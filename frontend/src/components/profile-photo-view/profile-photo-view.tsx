"use client";

import type { Photo, Comment } from "@/types";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaBookmark,
  FaRegBookmark,
  FaEllipsisH,
  FaTimes,
} from "react-icons/fa";
import { Image } from "@heroui/image";
import { Avatar } from "@heroui/avatar";
import { Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { CircularProgress } from "@heroui/progress";

import { useProfilePage } from "@/hooks/useProfilePage";
import { useSession } from "@/hooks/useSession";
import { getCommentsByPhotoId } from "@/actions/get-comments-by-photo-id";
import { likePhoto } from "@/actions/like-photo";
import { unlikePhoto } from "@/actions/unlike-photo";
import { commentPhoto } from "@/actions/comment-photo";
import { formatTimeDistance } from "@/utils/format-time-distance";
import useSWR, { mutate as globalMutate } from "swr";
import { api } from "@/config/axios";

type ProfilePhotoViewProps = {
  photo: Photo;
  updatePhotoInList?: (photo: Photo) => void;
};

export function ProfilePhotoView({
  photo,
  updatePhotoInList,
}: ProfilePhotoViewProps) {
  const { profile } = useProfilePage();
  const { isAuthenticated } = useSession();

  // SWR for the single photo
  const { data: swrPhoto, mutate } = useSWR(photo ? `/photo/${photo.id}` : null, (url) => api.get(url).then(res => res.data), { fallbackData: photo });
  const photoToShow = swrPhoto || photo;

  const [saved, setSaved] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCommentsMobile, setShowCommentsMobile] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    fetchComments();

    return () => {
      document.body.style.overflow = "";
      setComments([]);
    };
  }, [photoToShow.id]);

  const fetchComments = async () => {
    if (!photoToShow) return;
    setLoading(true);

    const { response, error } = await getCommentsByPhotoId(photoToShow.id);
    if (error || !response) {
      toast.error("Não foi possível retornar os comentários.");
      setComments([]);
    } else {
      setComments(response);
    }
    setLoading(false);
  };

  const toggleLike = async () => {
    if (photoToShow.isLiked) {
      const { error } = await unlikePhoto(photoToShow.id);
      if (error) return toast.error("Não foi possível tirar like da foto");
      mutate();
      globalMutate(`/photo/${photoToShow.id}`);
      globalMutate("/photo/user/" + profile.username); // update profile grid
      if (updatePhotoInList) updatePhotoInList({ ...photoToShow, isLiked: false, likesCount: photoToShow.likesCount - 1 });
    } else {
      const { error } = await likePhoto(photoToShow.id);
      if (error) return toast.error("Não foi possível dar like na foto");
      mutate();
      globalMutate(`/photo/${photoToShow.id}`);
      globalMutate("/photo/user/" + profile.username);
      if (updatePhotoInList) updatePhotoInList({ ...photoToShow, isLiked: true, likesCount: photoToShow.likesCount + 1 });
    }
  };

  const toggleSave = () => {
    setSaved(!saved);
  };

  const handleComment = async () => {
    if (comment.trim().length < 5) {
      return toast.error("Comentário precisa ter pelo menos 5 caracteres");
    }

    if (!isAuthenticated) {
      return toast.error("É necessário estar logado para comentar");
    }

    const { error, response } = await commentPhoto(photoToShow.id, comment);
    if (error) return toast.error(error);

    if (response) {
      setComments((prev) => [response, ...prev]);
      setComment("");
      toast.success("Comentário adicionado com sucesso.");
      mutate();
      globalMutate(`/photo/${photoToShow.id}`);
      globalMutate("/photo/user/" + profile.username);
      if (updatePhotoInList) updatePhotoInList({ ...photoToShow, commentsCount: photoToShow.commentsCount + 1 });
    }
  };

  const renderComments = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-32">
          <CircularProgress size="sm" />
        </div>
      );
    }

    if (!comments.length) {
      return (
        <div className="flex flex-col items-center justify-center h-32 text-gray-500">
          <FaComment className="w-12 h-12 mb-2 text-gray-300" />
          <p className="text-sm">Nenhum comentário ainda.</p>
          <p className="text-xs">Seja o primeiro a comentar.</p>
        </div>
      );
    }

    return comments.map((comment) => (
      <div key={comment.id} className="flex gap-3 items-start py-2">
        <Avatar
          className="flex-shrink-0"
          size="sm"
          src={comment.profile.avatarUrl}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link href={`/profile/${comment.profile.username}`}>
              <span className="font-semibold text-sm hover:text-gray-600 transition-colors">
                {comment.profile.username}
              </span>
            </Link>
            <span className="text-gray-500 text-xs">
              {formatTimeDistance(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm break-words leading-4">{comment.content}</p>
        </div>
      </div>
    ));
  };

  return (
    <>
      {/* Mobile/Tablet: Minimal view with expandable comments */}
      <div className="w-full h-full flex flex-col bg-white dark:bg-zinc-900 flex lg:hidden">
        {/* Image area */}
        <div className="flex-1 flex items-center justify-center bg-black dark:bg-zinc-900">
          <Image
            radius="none"
            alt={photoToShow.caption}
            className="object-contain max-h-[60vh] sm:max-h-[70vh] w-auto h-auto mx-auto"
            src={photoToShow.path}
          />
        </div>
        {/* Action bar (always at bottom) */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-4">
            <button
              className="hover:scale-110 transition-transform active:scale-95"
              onClick={toggleLike}
            >
              {photoToShow.isLiked ? (
                <FaHeart className="w-7 h-7 text-red-500" />
              ) : (
                <FaRegHeart className="w-7 h-7 text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300" />
              )}
            </button>
            <button
              className="hover:scale-110 transition-transform active:scale-95"
              onClick={() => setShowCommentsMobile(true)}
            >
              <FaComment className="w-7 h-7 text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300" />
            </button>
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{photoToShow.likesCount.toLocaleString()} curtidas</span>
        </div>
        {/* Comments/caption panel for mobile */}
        {showCommentsMobile && (
          <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-900 max-w-md w-full mx-auto rounded-lg shadow-lg">
            <div className="flex justify-end p-3">
              <button
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
                onClick={() => setShowCommentsMobile(false)}
                aria-label="Fechar comentários"
              >
                <FaTimes className="w-5 h-5 text-gray-900 dark:text-white" />
              </button>
            </div>
            {/* Caption */}
            {photoToShow.caption && (
              <div className="px-4 pb-2">
                <span className="font-semibold text-sm mr-2 text-gray-900 dark:text-white">{profile.username}</span>
                <span className="text-sm text-gray-900 dark:text-white">{photoToShow.caption}</span>
              </div>
            )}
            {/* Comments */}
            <div className="flex-1 overflow-y-auto px-4 py-2 min-h-0">
              {renderComments()}
            </div>
            {/* Comment input */}
            <div className="border-t border-gray-200 dark:border-zinc-800 pt-3 px-4 pb-4 bg-white dark:bg-zinc-900">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Textarea
                    className="text-sm"
                    classNames={{
                      input: "border-none shadow-none bg-transparent resize-none dark:text-white",
                      inputWrapper:
                        "border-none shadow-none bg-transparent p-0 min-h-[20px] dark:bg-zinc-900",
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
                  className={`text-sm font-semibold ${comment.trim().length >= 5
                    ? "text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    : "text-blue-300 dark:text-blue-900 cursor-not-allowed"
                    }`}
                  disabled={comment.trim().length < 5}
                  size="sm"
                  variant="light"
                  onPress={handleComment}
                >
                  Publicar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Desktop: Full Instagram-like two-column layout */}
      <div className="hidden lg:flex w-full h-full flex-row bg-white dark:bg-zinc-900">
        {/* Left: Image */}
        <div className="flex-1 flex items-center justify-center bg-black dark:bg-zinc-900 max-w-[700px] max-h-[90vh]">
          <Image
            radius="none"
            alt={photoToShow.caption}
            className="object-contain max-h-[90vh] w-auto h-auto mx-auto"
            src={photoToShow.path}
          />
        </div>
        {/* Right: Info + Comments */}
        <div className="flex flex-col w-[400px] max-w-[400px] h-full border-l border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  isBordered
                  className="w-8 h-8"
                  size="sm"
                  src={profile.avatarUrl || ""}
                />
                <div>
                  <Link href={`/profile/${profile.username}`}>
                    <h6 className="font-semibold text-sm hover:text-gray-600 dark:hover:text-white transition-colors text-gray-900 dark:text-white">
                      {profile.username}
                    </h6>
                  </Link>
                </div>
              </div>
              {/* Removed FaEllipsisH button as per previous user change */}
            </div>
          </div>
          {/* Caption (text only, no profile image or username) */}
          {photoToShow.caption && (
            <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex-shrink-0">
              <span className="text-sm text-gray-900 dark:text-white">{photoToShow.caption}</span>
            </div>
          )}
          {/* Comments - Scrollable area */}
          <div className="flex-1 overflow-y-auto px-4 py-2 min-h-0">
            {renderComments()}
          </div>
          {/* Actions - Fixed at bottom */}
          <div className="border-t border-gray-200 dark:border-zinc-800 p-4 flex-shrink-0 bg-white dark:bg-zinc-900">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <button
                  className="hover:scale-110 transition-transform active:scale-95"
                  onClick={toggleLike}
                >
                  {photoToShow.isLiked ? (
                    <FaHeart className="w-6 h-6 text-red-500" />
                  ) : (
                    <FaRegHeart className="w-6 h-6 text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300" />
                  )}
                </button>
                <button className="hover:scale-110 transition-transform active:scale-95">
                  <FaComment className="w-6 h-6 text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300" />
                </button>
              </div>
              <button
                className="hover:scale-110 transition-transform active:scale-95"
                onClick={toggleSave}
              >
                {saved ? (
                  <FaBookmark className="w-6 h-6 text-gray-900 dark:text-white" />
                ) : (
                  <FaRegBookmark className="w-6 h-6 text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300" />
                )}
              </button>
            </div>
            {/* Likes count */}
            <div className="mb-3">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {photoToShow.likesCount.toLocaleString()} curtidas
              </span>
            </div>
            {/* Time */}
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              {formatTimeDistance(photoToShow.uploadedAt)}
            </div>
            {/* Comment input */}
            <div className="border-t border-gray-200 dark:border-zinc-800 pt-3">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Textarea
                    className="text-sm"
                    classNames={{
                      input: "border-none shadow-none bg-transparent resize-none dark:text-white",
                      inputWrapper:
                        "border-none shadow-none bg-transparent p-0 min-h-[20px] dark:bg-zinc-900",
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
                  className={`text-sm font-semibold ${comment.trim().length >= 5
                    ? "text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    : "text-blue-300 dark:text-blue-900 cursor-not-allowed"
                    }`}
                  disabled={comment.trim().length < 5}
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
      </div>
    </>
  );
}
