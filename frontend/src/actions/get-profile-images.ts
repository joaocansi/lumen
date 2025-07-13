"use server";

import { cookies } from "next/headers";

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
      {
        headers: {
          Cookie: (await cookies()).toString(),
        },
      },
    );
    return { response: response.data };
  } catch {
    return {
      error: "Não foi possível realizar a solicitação",
    };
  }
}
