"use client";

import FollowButton from "./followButtton";

import { useSession } from "@/hooks/useSession";

type Profile = {
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

  // usuÃ¡rio logado (se existir)
  const loggedUsername = session?.user?.username;

  const isMe = loggedUsername === profile.username;

  return (
    <section className="flex flex-col sm:flex-row items-center gap-8">
      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
        <img
          alt={profile.username}
          className="object-cover w-full h-full"
          src={profile.avatarUrl || "/default-1.png"}
        />
      </div>

      <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
        <div className="flex items-center gap-4 mb-3">
          <h1 className="text-3xl font-bold text-gray-900">
            {profile.username}
          </h1>

          {!isMe && (
            <FollowButton
              initialIsFollowing={profile.isFollowing}
              username={profile.username}
            />
          )}
          {isMe && (
            <button className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100">
              Editar perfil
            </button>
          )}
        </div>

        <div className="flex gap-8 text-gray-700 font-medium mb-4">
          <div>
            <strong>{profile.photos ? profile.photos.length : 0}</strong>{" "}
            publicações
          </div>
          <div>
            <strong>{profile.followers}</strong> seguidores
          </div>
          <div>
            <strong>{profile.following}</strong> seguindo
          </div>
        </div>

        {profile.name && (
          <p className="mt-1 text-base font-semibold text-gray-800">
            {profile.name}
          </p>
        )}

        {profile.bio && (
          <p className="mt-1 text-sm text-gray-600 max-w-md">{profile.bio}</p>
        )}
      </div>
    </section>
  );
}
