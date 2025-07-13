"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";

import { ProfilePhotoView } from "./profile-photo-view";

import { Photo } from "@/types";

type ProfilePhotoViewModalProps = {
  photo: Photo | null;
  handleClose: () => void;
  updatePhotoInList?: (photo: Photo) => void;
};

export default function ProfilePhotoViewModal({
  photo,
  handleClose,
  updatePhotoInList,
}: ProfilePhotoViewModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (photo) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [photo, handleClose]);

  if (!photo) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 dark:bg-black dark:bg-opacity-95 backdrop-blur-sm">
      {/* Modal content */}
      <div className="relative w-full h-full max-w-md lg:max-w-[1100px] max-h-[90vh] bg-white dark:bg-zinc-900 rounded-lg overflow-hidden flex flex-col lg:flex-row shadow-lg mx-2 sm:mx-auto">
        {/* Close button (top right, absolute) */}
        <button
          className="absolute top-3 right-3 z-50 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 dark:bg-zinc-900 dark:bg-opacity-90 rounded-full transition-all duration-200 text-white"
          onClick={handleClose}
        >
          <FaTimes className="w-5 h-5" />
        </button>
        <ProfilePhotoView photo={photo} updatePhotoInList={updatePhotoInList} />
      </div>
      {/* Backdrop click to close */}
      <div
        className="absolute inset-0 -z-10"
        onClick={handleClose}
      />
    </div>,
    document.body
  );
}
