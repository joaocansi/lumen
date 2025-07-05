"use client";

import { useEffect, useMemo, useState } from "react";
import { Modal, ModalContent } from "@heroui/modal";
import { Image } from "@heroui/image";
import { Avatar } from "@heroui/avatar";
import { Divider } from "@heroui/divider";
import { Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import { useProfilePage } from "@/hooks/useProfilePage";

export function ProfilePhotoView() {
  const { profile, paginatedPhotos, openedPhotoIndex, setOpenedPhotoIndex } =
    useProfilePage();
  const [comments, setComments] = useState([]);

  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  const openedPhoto = useMemo(() => {
    if (openedPhotoIndex == -1) return null;
    const result = paginatedPhotos.data[openedPhotoIndex];
    if (!result) return null;

    const aspectRatio = Math.min(
      1.91,
      Math.max(result.width / result.height, 0.8),
    );

    return {
      ...result,
      aspectRatio,
    };
  }, [openedPhotoIndex]);

  useEffect(() => {
    if (openedPhotoIndex !== -1) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [openedPhotoIndex]);

  const handleClose = () => {
    setOpenedPhotoIndex(-1);
  };

  const toggleLike = async () => {
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <Modal
      className="rounded-none w-[95%] max-w-7xl sm:my-0 h-[calc(100vh-40px)] max-lg:h-auto"
      isOpen={openedPhotoIndex !== -1}
      onClose={handleClose}
    >
      <ModalContent>
        {openedPhoto && (
          <div className="grid grid-cols-9 w-full h-full max-lg:grid-cols-1">
            <div className="dark:bg-white bg-black col-span-6 flex items-center overflow-hidden relative">
              <Image
                alt={openedPhoto.caption}
                className="rounded-none w-full object-cover"
                src={openedPhoto.path}
              />
            </div>
            <div className="col-span-3 flex flex-col p-4 justify-between">
              <div>
                <div className="flex gap-3 items-center">
                  <Avatar isBordered size="sm" src={profile.avatarUrl || ""} />
                  <h6 className="font-medium dark:text-white">
                    {profile.username}
                  </h6>
                </div>
                <p className="mt-2 text-sm max-lg:hidden">
                  {openedPhoto.caption}
                </p>
                <Divider className="mt-2" />
              </div>

              <div className="flex flex-1 justify-between flex-col max-lg:hidden">
                <div className="flex flex-col gap-2 overflow-y-auto pr-2 mt-2">
                  {/* {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-2 items-start">
                      <Avatar
                        className="flex-shrink-0"
                        size="sm"
                        src={comment.avatarUrl}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm">
                            {comment.username}
                          </span>
                          <span className="text-xs text-gray-500">
                            {comment.timestamp}
                          </span>
                        </div>
                        <p className="text-sm mt-1 break-words">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))} */}
                </div>
                <Divider className="mb-4" />
              </div>

              <div className="flex flex-col gap-3 max-lg:mt-3">
                <div className="flex gap-2 items-center">
                  <button onClick={toggleLike}>
                    {liked ? (
                      <FaHeart className="text-red-500 w-5 h-5" />
                    ) : (
                      <FaRegHeart className="w-5 h-5" />
                    )}
                  </button>
                  <span className="text-sm">{likes} Curtidas</span>
                  {/* <FaRegComment className="w-5 h-5 ml-4" /> */}
                </div>
                <div className="flex gap-2">
                  <Textarea
                    maxRows={4}
                    minRows={1}
                    placeholder="Digite uma mensagem"
                    rows={1}
                    variant="underlined"
                  />
                  <Button size="sm">Enviar</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}
