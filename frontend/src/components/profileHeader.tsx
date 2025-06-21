"use client";

import { useState, useEffect } from "react";

import FollowButton from "./followButtton";

import { useSession } from "@/hooks/useSession";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const DEFAULT_AVATAR = "https://img.heroui.chat/image/avatar?w=150&h=150&u=1";

type Profile = {
  id: string;
  username: string;
  name?: string;
  bio?: string;
  avatarUrl?: string;
  followers: number;
  following: number;
  photos: [];
  isFollowing: boolean;
};

export function ProfileHeader({ profile }: { profile: Profile }) {
  const { session } = useSession();
  const [currentProfile, setCurrentProfile] = useState(profile);
  const [isLoading, setIsLoading] = useState(false);

  // Atualiza o perfil quando o username muda
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${API_URL}/profile/username/${profile.username}`,
          {
            credentials: "include",
            cache: "no-store",
          },
        );

        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setCurrentProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [profile.username]);

  const isOwnProfile =
    !!session &&
    (session.user?.username === currentProfile.username ||
      session.user?.id === currentProfile.id);

  const handleFollowChange = (newIsFollowing: boolean) => {
    setCurrentProfile((prev) => ({
      ...prev,
      isFollowing: newIsFollowing,
      followers: newIsFollowing
        ? prev.followers + 1
        : Math.max(0, prev.followers - 1),
    }));
  };

  return (
    <section className="flex flex-col sm:flex-row items-center gap-8">
      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
        <img
          alt={currentProfile.username}
          className="object-cover w-full h-full"
          src={currentProfile.avatarUrl || DEFAULT_AVATAR}
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
          }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
        <div className="flex items-center gap-4 mb-3">
          <h1 className="text-3xl font-bold text-gray-900">
            {currentProfile.username}
          </h1>

          {!isOwnProfile && (
            <FollowButton
              initialIsFollowing={currentProfile.isFollowing}
              username={currentProfile.username}
              onFollowChange={handleFollowChange}
            />
          )}
          {isOwnProfile && (
            <button className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100">
              Editar perfil
            </button>
          )}
        </div>

        {!isLoading && (
          <>
            <div className="flex gap-8 text-gray-700 font-medium mb-4">
              <div>
                <strong>{currentProfile.photos?.length || 0}</strong>{" "}
                publicações
              </div>
              <div>
                <strong>{currentProfile.followers}</strong> seguidores
              </div>
              <div>
                <strong>{currentProfile.following}</strong> seguindo
              </div>
            </div>

            {currentProfile.name && (
              <p className="mt-1 text-base font-semibold text-gray-800">
                {currentProfile.name}
              </p>
            )}

            {currentProfile.bio && (
              <p className="mt-1 text-sm text-gray-600 max-w-md">
                {currentProfile.bio}
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
