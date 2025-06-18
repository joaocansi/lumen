import { Hono } from "hono";
import { inject, injectable } from "tsyringe";
import { PhotoService } from "../services/photo.service";
import { HonoContext } from "../@types/hono-context";
import { z } from "zod";
import ServiceError, { ServiceErrorType } from "../errors/ServiceError";
import { mustBeAuthenticated } from "../middlewares/must-be-authenticated";

const newPhotoSchema = z.object({
  caption: z.string().min(1, "Caption is required"),
  userId: z.string().min(1, "User ID is required"),
  image: z.instanceof(File, { message: "Image must be a valid file" }),
});

const getPhotosByProfileSchema = z.object({
  limit: z.string().transform(Number).refine(val => Number.isInteger(val) && val >= 0, { message: "Limit must be a non-negative integer" }),
  offset: z.string().transform(Number).refine(val => Number.isInteger(val) && val >= 0, { message: "Offset must be a non-negative integer" }),
  username: z.string()
})

@injectable()
export class PhotoController extends Hono {
  constructor(
    @inject('PhotoService')
    private photoService: PhotoService
  ) {
    super();
    this.post("/", mustBeAuthenticated, this.newPhoto.bind(this));
    this.get("/:username", this.getPhotosByProfile.bind(this));
  }

  async newPhoto(c: HonoContext) {
    const body = await c.req.parseBody();
    const user = c.get("user")

    body['userId'] = user?.id as string

    try {
      const data = await newPhotoSchema.parseAsync(body);
      const photo = await this.photoService.newPhoto(data)
      return c.json(photo, 201)   
    } catch (error) {
      console.log(error);
      throw new ServiceError("Dados incorretos", ServiceErrorType.BadRequest);   
    }
  }

  async getPhotosByProfile(c: HonoContext) {
    const username = c.req.param('username');
    const queries = c.req.query();

    try {
      const data = await getPhotosByProfileSchema.parseAsync({ ...queries, username })
      const photos = await this.photoService.getPhotosByProfile(data);
      return c.json(photos); 
    } catch (error) {
      console.log(error)
      throw new ServiceError("Dados incorretos", ServiceErrorType.BadRequest);   
    }
  }
}
