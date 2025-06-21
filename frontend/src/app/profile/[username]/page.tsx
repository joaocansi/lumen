import { notFound, redirect } from "next/navigation";

import { ProfileHeader } from "@/components/profileHeader";
import { authClient } from "@/config/auth";

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

async function getProfile(username: string, token?: string): Promise<Profile> {
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/profile/username/${username}`,
    {
      headers,
      credentials: "include",
      cache: "no-store",
    },
  );

  if (res.status === 401) {
    redirect("/auth/signin");
  }

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to fetch profile");
  }

  return res.json();
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  try {
    const session = await authClient.getSession();
    if (!session) {
      redirect("/auth/signin");
    }

    const { username } = await params;
    const profile = await getProfile(username);

    return (
      <main className="max-w-5xl mx-auto px-4 py-10">
        <ProfileHeader profile={profile} />
      </main>
    );
  } catch (error) {
    console.error("Profile page error:", error);
    notFound();
  }
}
