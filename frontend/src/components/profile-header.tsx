"use client";

import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";

import { useProfilePage } from "@/hooks/useProfilePage";
import { useState } from "react";
import { EditProfileModal } from "./edit-profile-modal";
import { api } from "@/config/axios";
import toast from "react-hot-toast";

const DEFAULT_AVATAR = "https://img.heroui.chat/image/avatar?w=150&h=150&u=1";

export function ProfileHeader() {
  const { profile, setProfile } = useProfilePage();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleProfileToggleFollow() {
    setIsLoading(true);
    try {
      if (profile._session.isFollowing) {
        await api.delete(`/profile/follow/${profile.username}`);
        setProfile((prev) => ({
          ...prev,
          followersCount: prev.followersCount - 1,
          _session: { ...prev._session, isFollowing: false },
        }));
        toast.success("Você deixou de seguir!");
      } else {
        await api.post(`/profile/follow/${profile.username}`);
        setProfile((prev) => ({
          ...prev,
          followersCount: prev.followersCount + 1,
          _session: { ...prev._session, isFollowing: true },
        }));
        toast.success("Agora você está seguindo!");
      }
    } catch {
      toast.error("Erro ao atualizar o status de seguir.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleEditProfileClick() {
    setIsEditModalOpen(true);
  }

  function handleCloseEditModal() {
    setIsEditModalOpen(false);
  }

  async function handleSaveProfile(data: { name: string; bio: string; image: string }) {
    try {
      await api.patch("/profile", data);
      setIsEditModalOpen(false);
      toast.success("Perfil atualizado com sucesso");
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
    }
  }

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
              isLoading={isLoading}
            >
              {profile._session.isFollowing ? "Seguindo" : "Seguir"}
            </Button>
          )}
          {profile._session.isOwnProfile && (
            <Button color="default" size="sm" onPress={handleEditProfileClick}>
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
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveProfile}
      />
    </section>
  );
}
