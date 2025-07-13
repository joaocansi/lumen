"use server";

import { cookies } from "next/headers";

import { api } from "@/config/axios";
import { ActionResponse, Paginated, PhotoWithProfile } from "@/types";

type GetPhotos = ActionResponse<Paginated<PhotoWithProfile>>;

export async function getPhotos(offset = 0, limit = 20): Promise<GetPhotos> {
  try {
    const response = await api.get(`/photo?limit=${limit}&offset=${offset}`, {
      headers: {
        Cookie: (await cookies()).toString(),
      },
    });
    return { response: response.data };
  } catch {
    return {
      error: "Não foi possível realizar a solicitação",
    };
  }
}
