import { Hono } from "hono";
import { inject, injectable } from "tsyringe";
import { PhotoService } from "../services/photo.service";
import { HonoContext } from "../@types/hono-context";
import { z } from "zod";
import ServiceError, { ServiceErrorType } from "../errors/ServiceError";
import { mustBeAuthenticated } from "../middlewares/must-be-authenticated";
import { isAuthenticated } from "../middlewares/is-authenticated";

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
    this.get("/user/:username", this.getPhotosByProfile.bind(this));
    this.get('/:photoId', isAuthenticated, this.getPhotoById.bind(this));
    this.post("/:photoId/like", mustBeAuthenticated, this.likePhoto.bind(this));
    this.delete("/:photoId/like", mustBeAuthenticated, this.unlikePhoto.bind(this));
  }

  async getPhotoById(c: HonoContext) {
    console.log('fasdf')
    const photoId = c.req.param('photoId');
    const user = c.get("user")

    const photo = await this.photoService.getPhotoById(photoId, user?.id);
    return c.json(photo);
  }

  async newPhoto(c: HonoContext) {
    const body = await c.req.parseBody();
    const user = c.get("user")

    body['userId'] = user?.id as string

    const data = await newPhotoSchema.parseAsync(body);
    const photo = await this.photoService.newPhoto(data)
    return c.json(photo, 201)
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

  async likePhoto(c: HonoContext) {
    const photoId = c.req.param('photoId');
    const user = c.get("user");

    if (!user) {
      throw new ServiceError("Usuário não autenticado", ServiceErrorType.Unauthorized);
    }

    await this.photoService.likePhoto(photoId, user.id);
  }

  async unlikePhoto(c: HonoContext) {
    const photoId = c.req.param('photoId');
    const user = c.get("user");

    if (!user) {
      throw new ServiceError("Usuário não autenticado", ServiceErrorType.Unauthorized);
    }

    await this.photoService.unlikePhoto(photoId, user.id);
  }
}
