import { api } from "@/config/axios";
import { ActionResponse } from "@/types";

export async function likePhoto(photoId: string): Promise<ActionResponse<{}>> {
  try {
    await api.post(`/photo/${photoId}/like`);
    return {
      response: {},
    };
  } catch {
    return {
      error: "Não foi possível dar like na imagem.",
    };
  }
}
