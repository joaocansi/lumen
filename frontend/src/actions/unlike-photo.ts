import { api } from "@/config/axios";
import { ActionResponse } from "@/types";

export async function unlikePhoto(
  photoId: string,
): Promise<ActionResponse<{}>> {
  try {
    await api.delete(`/photo/${photoId}/like`);
    return {
      response: {},
    };
  } catch (error) {
    return {
      error: {
        details: error,
      },
    };
  }
}
