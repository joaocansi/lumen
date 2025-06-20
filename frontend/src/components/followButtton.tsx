"use client";

import { useState } from "react";

export default function FollowButton({
  username,
  initialIsFollowing = false,
}: {
  username: string;
  initialIsFollowing?: boolean;
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  const toggleFollow = async () => {
    setLoading(true);
    try {
      await fetch(
        `http://localhost:3001/profile/${isFollowing ? "unfollow" : "follow"}/${username}`,
        {
          method: isFollowing ? "DELETE" : "POST",
          credentials: "include",
        },
      );
      setIsFollowing(!isFollowing);
    } catch (err) {
      alert("Erro ao seguir/desseguir");
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
