"use server";

import { api } from "@/config/axios";
import { ActionResponse, Paginated, Photo } from "@/types";

type GetProfileImages = ActionResponse<Paginated<Photo>>;

export async function getProfileImages(
  username: string,
  offset = 0,
  limit = 20,
): Promise<GetProfileImages> {
  try {
    const response = await api.get(
      `/photo/user/${username}?limit=${limit}&offset=${offset}`,
    );
    return { response: response.data };
  } catch (error) {
    return {
      error: {
        details: error,
      },
    };
  }
}
