"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react";
import toast from "react-hot-toast";

import { Paginated, Photo, ProfileWithMetadataAndSessionInfo } from "@/types";
import { getProfileImages } from "@/actions/get-profile-images";

export interface ProfilePageProps {
  profile: ProfileWithMetadataAndSessionInfo;
  paginatedPhotos: Paginated<Photo>;
  openedPhotoIndex: number;
  setOpenedPhotoIndex: Dispatch<SetStateAction<number>>;
  retrieveMorePhotos: () => Promise<void>;
}

export const ProfilePageContext = createContext({} as ProfilePageProps);

interface ProfilePageProviderProps {
  children: React.ReactNode;
  profile: ProfileWithMetadataAndSessionInfo;
}

export function ProfilePageProvider({
  children,
  profile,
}: ProfilePageProviderProps) {
  const [openedPhotoIndex, setOpenedPhotoIndex] = useState<number>(-1);
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
    <ProfilePageContext.Provider
      value={{
        profile,
        paginatedPhotos,
        openedPhotoIndex,
        setOpenedPhotoIndex,
        retrieveMorePhotos,
      }}
    >
      {children}
    </ProfilePageContext.Provider>
  );
}

export const useProfilePage = () => useContext(ProfilePageContext);
