import { api } from "@/config/axios";
import { ActionResponse, Comment } from "@/types";

type GetCommentsByPhotoId = ActionResponse<Comment[]>;

export async function getCommentsByPhotoId(
  photoId: string,
): Promise<GetCommentsByPhotoId> {
  try {
    const response = await api.get(`/photo/${photoId}/comments`);
    return { response: response.data as Comment[] };
  } catch {
    return {
      error: "Não foi possível encontrar comentários.",
    };
  }
}
