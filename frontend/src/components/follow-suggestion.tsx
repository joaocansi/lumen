import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Skeleton } from "@heroui/skeleton";
import { Avatar } from "@heroui/avatar";

import { api } from "@/config/axios";
import { useSession } from "@/hooks/useSession";

type SuggestedUser = {
  username: string;
  name: string;
  image: string;
  mutualFriendUsernames: string[];
};

export function FollowSuggestion() {
  const { isAuthenticated } = useSession();

  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    };

    api
      .get<SuggestedUser[]>("/profile/get-top-k-to-follow")
      .then((res) => setSuggestedUsers(res.data))
      .catch(() => toast.error("Erro ao carregar sugestões"))
      .finally(() => setIsLoading(false));
  }, []);

  const handleFollow = async (username: string) => {
    try {
      await api.post(`/profile/follow/${username}`);
      setFollowedUsers((prev) => new Set(prev).add(username));
      toast.success("Usuário seguido com sucesso!");
    } catch {
      toast.error("Erro ao seguir usuário!");
    }
  };

  const handleUnfollow = async (username: string) => {
    try {
      await api.delete(`/profile/follow/${username}`);
      setFollowedUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(username);
        return newSet;
      });
      toast.success("Usuário desseguido com sucesso!");
    } catch {
      toast.error("Erro ao desseguir usuário!");
    }
  };

  const renderSkeleton = () =>
    Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-3 w-28 rounded" />
            <Skeleton className="h-2 w-24 rounded" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded" />
      </div>
    ));

  const renderUserCard = (user: SuggestedUser) => {
    const isFollowing = followedUsers.has(user.username);

    return (
      <div key={user.username} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
            src={user.image}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user.username}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.mutualFriendUsernames.length > 0
                ? `Seguido por ${user.mutualFriendUsernames[0]}${user.mutualFriendUsernames.length > 1 ? " e outros" : ""
                }`
                : "Sem amigos em comum"}
            </p>
          </div>
        </div>

        {isFollowing ? (
          <button
            className="text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white px-2 py-1 rounded border border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            onClick={() => handleUnfollow(user.username)}
          >
            Seguindo
          </button>
        ) : (
          <button
            className="text-xs font-medium text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 transition-colors"
            onClick={() => handleFollow(user.username)}
          >
            Seguir
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="max-md:hidden w-80 sticky top-8 h-fit">
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Sugestões para você
          </h3>
        </div>

        <div className="space-y-3">
          {isLoading
            ? renderSkeleton()
            : suggestedUsers.map((user) => renderUserCard(user))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-zinc-800">
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            © 2025 Lumen
          </p>
        </div>
      </div>
    </div>
  );
}
