import { Hono } from "hono";
import { inject, injectable } from "tsyringe";
import { PhotoService } from "../services/photo.service";
import { HonoContext } from "../@types/hono-context";
import { z } from "zod";
import ServiceError from "../errors/ServiceError";
import { mustBeAuthenticated } from "../middlewares/must-be-authenticated";

const newPhotoSchema = z.object({
  caption: z.string().min(1, "Caption is required"),
  userId: z.string().min(1, "User ID is required"),
  image: z.instanceof(File, { message: "Image must be a valid file" }),
});

@injectable()
export class PhotoController extends Hono {
  constructor(
    @inject('PhotoService')
    private photoService: PhotoService
  ) {
    super();
    this.post("/", mustBeAuthenticated, this.newPhoto.bind(this));
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
        return ServiceError.internalServerError(c);    
    }
  }
}
