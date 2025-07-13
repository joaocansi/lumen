import { api } from "@/config/axios";
import { ActionResponse, Comment } from "@/types";

export async function commentPhoto(
  photoId: string,
  comment: string,
): Promise<ActionResponse<Comment>> {
  try {
    const res = await api.post(`/photo/${photoId}/comment`, {
      content: comment,
    });
    return {
      response: res.data,
    };
  } catch {
    return {
      error: "Não foi possível realizar comentário.",
    };
  }
}
