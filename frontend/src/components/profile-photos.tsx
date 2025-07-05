"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { CircularProgress } from "@heroui/progress";

import { ProfilePhoto } from "./profile-photo";
import { ProfilePhotoView } from "./profile-photo-view";

import { useProfilePage } from "@/hooks/useProfilePage";

export default function ProfilePhotos() {
  const { paginatedPhotos, retrieveMorePhotos } = useProfilePage();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) retrieveMorePhotos();
  }, [inView]);

  return (
    <div>
      <div className="w-full grid grid-cols-3 gap-4 mt-4">
        {paginatedPhotos.data.map((item, index) => (
          <ProfilePhoto
            key={`profile-photo-${index}`}
            photo={item}
            photoPos={index}
          />
        ))}
      </div>
      {paginatedPhotos.data.length < paginatedPhotos.total && (
        <div ref={ref} className="flex justify-center my-4">
          <CircularProgress aria-label="Loading..." />
        </div>
      )}
      <ProfilePhotoView />
    </div>
  );
}
