import { FaComment, FaHeart } from "react-icons/fa";
import { Image } from "@heroui/image";

import { Photo } from "@/types";
import { useProfilePage } from "@/hooks/useProfilePage";

type ProfilePhotoProps = {
  photo: Photo;
  photoPos: number;
};

export function ProfilePhoto({ photo, photoPos }: ProfilePhotoProps) {
  const { setOpenedPhotoIndex } = useProfilePage();

  const handlePhotoClick = () => {
    setOpenedPhotoIndex(photoPos);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handlePhotoClick();
    }
  };

  return (
    <div
      aria-label={`View photo ${photoPos + 1} with ${photo.likesCount} likes and ${photo.commentsCount} comments`}
      className="relative w-full h-full col-span aspect-[9/10] cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={handlePhotoClick}
      onKeyDown={handleKeyDown}
    >
      <Image
        alt={`Photo ${photoPos + 1}`}
        classNames={{
          img: "w-full h-full object-cover",
          wrapper: "w-full h-full aspect-[9/10]",
        }}
        radius="none"
        src={photo.path}
      />
      <div className="absolute w-full h-full top-0 group z-10">
        <div className="bg-black opacity-0 group-hover:opacity-45 transition-opacity w-full h-full absolute top-0 left-0" />
        <div className="bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity w-full h-full absolute top-0 left-0 flex items-center justify-center gap-4">
          <span className="text-lg text-white flex items-center gap-1">
            <FaHeart /> {photo.likesCount}
          </span>
          <span className="text-lg text-white flex items-center gap-1">
            <FaComment /> {photo.commentsCount}
          </span>
        </div>
      </div>
    </div>
  );
}
