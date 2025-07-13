import { Hono } from "hono";
import { inject, injectable } from "tsyringe";
import { PhotoService } from "../services/photo.service";
import { HonoContext } from "../@types/hono-context";
import { z } from "zod";
import ServiceError, { ServiceErrorType } from "../errors/ServiceError";
import { mustBeAuthenticated } from "../middlewares/must-be-authenticated";
import { isAuthenticated } from "../middlewares/is-authenticated";
import { User } from "better-auth/types";
import { CommentService } from "../services/comment.service";

const newPhotoSchema = z.object({
  caption: z.string().min(1, "Caption is required"),
  userId: z.string().min(1, "User ID is required"),
  image: z.instanceof(File, { message: "Image must be a valid file" }),
});

const getPhotosByProfileSchema = z.object({
  limit: z.string().transform(Number).refine(val => Number.isInteger(val) && val >= 0, { message: "Limit must be a non-negative integer" }),
  offset: z.string().transform(Number).refine(val => Number.isInteger(val) && val >= 0, { message: "Offset must be a non-negative integer" }),
  username: z.string(),
  user: z.object({
    id: z.string().min(1, "User ID is required")
  }).nullable(),
})

const getPhotosSchema = z.object({
  limit: z.string().transform(Number).refine(val => Number.isInteger(val) && val >= 0, { message: "Limit must be a non-negative integer" }),
  offset: z.string().transform(Number).refine(val => Number.isInteger(val) && val >= 0, { message: "Offset must be a non-negative integer" }),
  user: z.object({
    id: z.string().min(1, "User ID is required")
  }).nullable(),
});

const newCommentSchema = z.object({
  user: z.object({
    id: z.string().min(1, "User ID is required")
  }),
  photoId: z.string().min(1, "Photo ID is required"),
  content: z.string().min(1, "Comment Content is required"),
});

@injectable()
export class PhotoController extends Hono {
  constructor(
    @inject('PhotoService')
    private photoService: PhotoService,
    @inject('CommentService')
    private commentService: CommentService
  ) {
    super();

    this.post("/", mustBeAuthenticated, this.newPhoto.bind(this));
    this.get("/user/:username", isAuthenticated, this.getPhotosByProfile.bind(this));
    this.get('/:photoId/comments', isAuthenticated, this.getPhotoComments.bind(this));
    this.post('/:photoId/comment', mustBeAuthenticated, this.newPhotoComment.bind(this))
    this.get('/:photoId', isAuthenticated, this.getPhotoById.bind(this));
    this.post("/:photoId/like", mustBeAuthenticated, this.likePhoto.bind(this));
    this.delete("/:photoId/like", mustBeAuthenticated, this.unlikePhoto.bind(this));
    this.get('/', isAuthenticated, this.getPhotos.bind(this));
  }

  async getPhotos(c: HonoContext) {
    const queries = c.req.query();
    const user = c.get('user');

    let data: z.infer<typeof getPhotosSchema>;
    try {
      data = await getPhotosSchema.parseAsync({...queries, user})
    } catch (error) {
      console.log(error)
      throw new ServiceError("Dados incorretos", ServiceErrorType.BadRequest);   
    }

    const photos = await this.photoService.getPhotos(data);
    return c.json(photos);
  }

  async getPhotoById(c: HonoContext) {
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
    const user = c.get('user');
  
    let data: z.infer<typeof getPhotosByProfileSchema>;
    try {
      data = await getPhotosByProfileSchema.parseAsync({ ...queries, username, user })
    } catch (error) {
      console.log(error)
      throw new ServiceError("Dados incorretos", ServiceErrorType.BadRequest);   
    }

    const photos = await this.photoService.getPhotosByProfile(data);
    return c.json(photos); 
  }

  async likePhoto(c: HonoContext) {
    const photoId = c.req.param('photoId');
    const user = c.get("user") as User;

    await this.photoService.likePhoto(photoId, user.id);
    return c.json({});
  }

  async unlikePhoto(c: HonoContext) {
    const photoId = c.req.param('photoId');
    const user = c.get("user") as User;

    await this.photoService.unlikePhoto(photoId, user.id);
    return c.json({});
  }

  async getPhotoComments(c: HonoContext) {
    const photoId = c.req.param('photoId');
    const result = await this.photoService.getPhotoComments(photoId);
    return c.json(result);
  }

  async newPhotoComment(c: HonoContext) {
    const body = await c.req.json();
    const photoId = c.req.param('photoId');
    const user = c.get('user');

    let data: z.infer<typeof newCommentSchema>;
    try {
      data = await newCommentSchema.parseAsync({ content: body.content, photoId, user });
    } catch (error) {
      console.log(body, error)
      throw new ServiceError("Dados incorretos", ServiceErrorType.BadRequest);   
    }
    
    const result = await this.commentService.newComment(data);
    return c.json(result);
  }
}
