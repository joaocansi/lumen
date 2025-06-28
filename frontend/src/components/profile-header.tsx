"use client";

import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";

import { useProfilePage } from "@/hooks/useProfilePage";

const DEFAULT_AVATAR = "https://img.heroui.chat/image/avatar?w=150&h=150&u=1";

export function ProfileHeader() {
  const { profile } = useProfilePage();

  async function handleProfileToggleFollow() {}

  return (
    <section className="flex flex-col sm:flex-row items-center gap-8">
      <Avatar
        isBordered
        alt={profile.username}
        className="w-40 h-40 text-large"
        color="default"
        src={profile.avatarUrl || DEFAULT_AVATAR}
      />

      <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
        <div className="flex items-center gap-4 mb-3">
          <h1 className="text-2xl font-bold">{profile.username}</h1>

          {!profile._session.isOwnProfile && (
            <Button
              color={profile._session.isFollowing ? "default" : "primary"}
              size="sm"
              onPress={handleProfileToggleFollow}
            >
              {profile._session.isFollowing ? "Seguindo" : "Seguir"}
            </Button>
          )}
          {profile._session.isOwnProfile && (
            <Button color="default" size="sm">
              Editar Perfil
            </Button>
          )}
        </div>

        <div className="flex gap-8 font-medium mb-4">
          <div>
            <strong>{profile.photosCount}</strong> publicações
          </div>
          <div>
            <strong>{profile.followersCount}</strong> seguidores
          </div>
          <div>
            <strong>{profile.followingCount}</strong> seguindo
          </div>
        </div>

        <p className="mt-1 text-base font-semibold">{profile.name}</p>

        <p className="mt-1 text-sm max-w-md">{profile.bio}</p>
      </div>
    </section>
  );
}
