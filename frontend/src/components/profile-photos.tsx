"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { CircularProgress } from "@heroui/progress";
import toast from "react-hot-toast";

import { ProfilePhoto } from "./profile-photo";
import ProfilePhotoViewModal from "./profile-photo-view/profile-photo-view-modal";

import { useProfilePage } from "@/hooks/useProfilePage";
import { Photo } from "@/types";
import useSWR from "swr";
import { api } from "@/config/axios";

export default function ProfilePhotos() {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const { profile } = useProfilePage();
  const { ref, inView } = useInView();
  const LIMIT = 20;
  const [offset, setOffset] = useState(0);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [total, setTotal] = useState(0);

  // SWR for the current page
  const { data, mutate, isValidating } = useSWR(
    profile ? `/photo/user/${profile.username}?limit=${LIMIT}&offset=${offset}` : null,
    (url) => api.get(url).then(res => res.data),
    { revalidateOnFocus: false, fallbackData: { data: [], total: 0 } }
  );

  // When data changes, append new photos
  useEffect(() => {
    if (data && data.data) {
      setPhotos((prev) => {
        // Avoid duplicates
        const ids = new Set(prev.map((p) => p.id));
        const newPhotos = data.data.filter((p: Photo) => !ids.has(p.id));
        return [...prev, ...newPhotos];
      });
      setTotal(data.total);
    }
  }, [data]);

  // Infinite scroll: fetch next page when inView
  useEffect(() => {
    if (inView && photos.length < total && !isValidating) {
      setOffset((prev) => prev + LIMIT);
    }
  }, [inView, photos.length, total, isValidating]);

  // Add this function to update a photo in the local state
  function updatePhotoInList(updatedPhoto: Photo) {
    setPhotos((prev) =>
      prev.map((p) => (p.id === updatedPhoto.id ? { ...p, ...updatedPhoto } : p))
    );
  }

  function handlePhotoViewClose() {
    setPhoto(null);
    mutate();
  }

  async function handlePhotoClick(photoId: string) {
    const found = photos.find((p) => p.id === photoId);
    if (found) {
      setPhoto(found);
    } else {
      try {
        const res = await api.get("/photo/" + photoId);
        setPhoto(res.data);
      } catch {
        toast.error("Não foi possível mostrar a foto");
      }
    }
  }

  return (
    <div>
      <div className="w-full grid grid-cols-3 gap-4 mt-4">
        {photos.map((item: Photo, index: number) => (
          <ProfilePhoto
            key={`profile-photo-${index}`}
            photo={item}
            onClick={handlePhotoClick}
          />
        ))}
      </div>

      {photos.length < total && (
        <div ref={ref} className="flex justify-center my-4">
          <CircularProgress aria-label="Loading..." />
        </div>
      )}

      {/* @ts-expect-error ReactPortal type mismatch workaround */}
      {ProfilePhotoViewModal({ handleClose: handlePhotoViewClose, photo, updatePhotoInList })}
    </div>
  );
}
