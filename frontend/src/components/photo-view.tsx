/* eslint-disable @next/next/no-img-element */
import { Avatar } from "@heroui/avatar";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaBookmark,
  FaRegBookmark,
  FaEllipsisH,
} from "react-icons/fa";
import { Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

import { Comment, PhotoWithProfile } from "@/types";
import { commentPhoto } from "@/actions/comment-photo";
import { unlikePhoto } from "@/actions/unlike-photo";
import { likePhoto } from "@/actions/like-photo";
import { useSession } from "@/hooks/useSession";
import { formatTimeDistance } from "@/utils/format-time-distance";
import { getCommentsByPhotoId } from "@/actions/get-comments-by-photo-id";

type PhotoViewProps = {
  photo: PhotoWithProfile;
};

export function PhotoView({ photo }: PhotoViewProps) {
  const { isAuthenticated } = useSession();

  const [likes, setLikes] = useState(photo.likesCount);
  const [liked, setLiked] = useState(photo.isLiked);
  const [saved, setSaved] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);

  const toggleLike = async () => {
    if (!liked) {
      const { error } = await likePhoto(photo.id);
      if (error) {
        toast.error("Não foi possível dar like na foto");
        return;
      }

      setLiked(true);
      setLikes((prev) => prev + 1);

      return;
    }

    const { error } = await unlikePhoto(photo.id);
    if (error) {
      toast.error("Não foi possível tirar like da foto");
      return;
    }

    setLiked(false);
    setLikes((prev) => Math.max(0, prev - 1));
    return;
  };

  useEffect(() => {
    getComments();
  }, []);

  const getComments = async () => {
    const { response } = await getCommentsByPhotoId(photo.id);
    if (!response) return;

    setComments(response);
  };

  const handleComment = async () => {
    if (comment.length < 5) {
      toast.error("Comentário precisa ter pelo menos 5 caracteres");
      return;
    }

    if (!isAuthenticated) {
      toast.error("É necessário estar logado para comentar");
      return;
    }

    const { error, response } = await commentPhoto(photo.id, comment);
    if (error) {
      toast.error(error);
      return;
    }

    if (!response) return;

    setComments((prev) => [response, ...prev]);
    setComment("");
    toast.success("Comentário adicionado com sucesso.");
  };

  const toggleSave = () => {
    setSaved(!saved);
  };

  const formatTimeAgo = () => {
    return formatTimeDistance(photo.uploadedAt);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg mx-auto mb-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8" size="sm" src={photo.user.image || ""} />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {photo.user.username}
            </span>
          </div>
        </div>
        <button className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
          <FaEllipsisH className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Photo */}
      <div className="relative bg-black aspect-square">
        <img
          alt="Post"
          className="w-full h-full object-cover"
          src={photo.path}
        />
      </div>

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button
              className="hover:scale-110 transition-transform active:scale-95"
              onClick={toggleLike}
            >
              {liked ? (
                <FaHeart className="w-6 h-6 text-red-500" />
              ) : (
                <FaRegHeart className="w-6 h-6 text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-400" />
              )}
            </button>
            <button
              className="hover:scale-110 transition-transform active:scale-95"
              onClick={() => setShowComments(!showComments)}
            >
              <FaComment className="w-6 h-6 text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-400" />
            </button>
          </div>
          <button
            className="hover:scale-110 transition-transform active:scale-95"
            onClick={toggleSave}
          >
            {saved ? (
              <FaBookmark className="w-6 h-6 text-gray-900 dark:text-white" />
            ) : (
              <FaRegBookmark className="w-6 h-6 text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-400" />
            )}
          </button>
        </div>

        {/* Likes count */}
        <div className="mb-2">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {likes.toLocaleString()} curtidas
          </span>
        </div>

        {/* Caption */}
        {photo.caption && (
          <div className="mb-2">
            <span className="text-sm text-gray-900 dark:text-gray-200">
              <span className="font-semibold mr-2">{photo.user.username}</span>
              {photo.caption}
            </span>
          </div>
        )}

        {/* Comments */}
        {photo.commentsCount > 0 && (
          <button
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-2 block"
            onClick={() => setShowComments(!showComments)}
          >
            Ver todos os {photo.commentsCount} comentários
          </button>
        )}

        {showComments && (
          <div className="mb-3 space-y-1">
            {comments.map((item, index) => (
              <div
                key={`image-${photo.id}-commment-${index}`}
                className="text-sm text-gray-900 dark:text-gray-200"
              >
                <Link href={`/profile/${item.profile.username}`}>
                  <span className="font-semibold text-gray-900 dark:text-white mr-2">
                    {item.profile.username}
                  </span>
                </Link>
                {item.content}
              </div>
            ))}
          </div>
        )}

        {/* Time ago */}
        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          {formatTimeAgo()}
        </div>

        {/* Comment input */}
        <div className="border-t border-gray-200 dark:border-zinc-800 pt-3">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Textarea
                className="text-sm text-gray-900 dark:text-white"
                classNames={{
                  input:
                    "border-none shadow-none bg-transparent resize-none dark:placeholder:text-gray-400",
                  inputWrapper:
                    "border-none shadow-none bg-transparent p-0 min-h-[20px]",
                }}
                maxRows={4}
                minRows={1}
                placeholder="Adicione um comentário..."
                value={comment}
                variant="flat"
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <Button
              className={`text-sm font-semibold ${
                comment.length >= 5
                  ? "text-blue-500 hover:text-blue-700"
                  : "text-blue-300 cursor-not-allowed"
              }`}
              disabled={comment.length < 5}
              size="sm"
              variant="light"
              onPress={handleComment}
            >
              Publicar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
