"use client";

import { createContext, Dispatch, SetStateAction, useCallback, useContext, useState } from "react";
import toast from "react-hot-toast";
import { SWRConfig } from "swr";

import { Paginated, Photo, ProfileWithMetadataAndSessionInfo } from "@/types";
import { getProfileImages } from "@/actions/get-profile-images";
import { api } from "@/config/axios";

export interface ProfilePageProps {
  profile: ProfileWithMetadataAndSessionInfo;
  paginatedPhotos: Paginated<Photo>;
  setProfile: Dispatch<SetStateAction<ProfileWithMetadataAndSessionInfo>>;
  retrieveMorePhotos: () => Promise<void>;
}

export const ProfilePageContext = createContext({} as ProfilePageProps);

const fetcher = (url: string) => api.get(url).then((res) => res.data);

interface ProfilePageProviderProps {
  children: React.ReactNode;
  profile: ProfileWithMetadataAndSessionInfo;
}

export function ProfilePageProvider({
  children,
  profile,
}: ProfilePageProviderProps) {
  const [profileState, setProfile] = useState<ProfileWithMetadataAndSessionInfo>(profile);
  const [paginatedPhotosOffset, setPaginatedPhotosOffset] = useState(0);
  const [paginatedPhotos, setPhotos] = useState<Paginated<Photo>>({
    data: [],
    total: profile.photosCount,
  });

  const retrieveMorePhotos = useCallback(async () => {
    const { error, response } = await getProfileImages(
      profile.username,
      paginatedPhotosOffset,
      20,
    );

    if (error || !response) {
      toast.error("Não foi possível realizar operação");
      return;
    }

    const { data, total } = response;
    setPhotos((prev) => ({ data: [...prev.data, ...data], total }));

    if (paginatedPhotosOffset + data.length < total)
      setPaginatedPhotosOffset((prev) => prev + data.length);
  }, [paginatedPhotosOffset, setPhotos, setPaginatedPhotosOffset]);

  return (
    <SWRConfig value={{ suspense: true, fetcher }}>
      <ProfilePageContext.Provider
        value={{
          profile: profileState,
          paginatedPhotos,
          retrieveMorePhotos,
          setProfile,
        }}
      >
        {children}
      </ProfilePageContext.Provider>
    </SWRConfig>
  );
}

export const useProfilePage = () => useContext(ProfilePageContext);
