"use client";

import { useState } from "react";

interface FollowButtonProps {
  username: string;
  initialIsFollowing: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
}

export default function FollowButton({
  username,
  initialIsFollowing,
  onFollowChange,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  const toggleFollow = async () => {
    setLoading(true);
    try {
      const method = isFollowing ? "DELETE" : "POST";
      const response = await fetch(
        `http://localhost:3000/api/profile/follow/${username}`,
        {
          method,
          credentials: "include",
        },
      );

      if (!response.ok) throw new Error("Failed to follow/unfollow");

      const newIsFollowing = !isFollowing;
      setIsFollowing(newIsFollowing);
      onFollowChange?.(newIsFollowing); // Chamada opcional para callback
    } catch (err) {
      console.error("Follow error:", err);
      // Aqui você pode adicionar toast.error() ou outro feedback
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`px-4 py-1 rounded border ${
        isFollowing
          ? "bg-gray-200 text-black hover:bg-gray-300"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
      disabled={loading}
      onClick={toggleFollow}
    >
      {loading ? "..." : isFollowing ? "Deixar de seguir" : "Seguir"}
    </button>
  );
}
