<<<<<<< HEAD
import { notFound } from "next/navigation";
import { Divider } from "@heroui/divider";
import { headers } from "next/headers";

import { ProfileHeader } from "@/components/profile-header";
import { ProfilePageProvider } from "@/hooks/useProfilePage";
import { api } from "@/config/axios";
import { ProfileWithMetadataAndSessionInfo } from "@/types";
import { Navbar } from "@/components/navbar";
import ProfilePhotos from "@/components/profile-photos";

async function getProfile(
  username: string,
): Promise<ProfileWithMetadataAndSessionInfo | null> {
  try {
    const rawHeaders = await headers();
    const pageHeaders = Object.fromEntries(rawHeaders);

    const res = await api.get<ProfileWithMetadataAndSessionInfo>(
      `/profile/username/${username}`,
      { headers: pageHeaders },
    );

    return res.data;
  } catch {
    return null;
  }
=======
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
>>>>>>> main
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
<<<<<<< HEAD
  const { username } = await params;
  const profile = await getProfile(username);

  if (!profile) {
    notFound();
  }

  return (
    <ProfilePageProvider profile={profile}>
      <Navbar />
      <main className="max-w-4xl mx-auto w-[90%] mt-5">
        <ProfileHeader />
        <Divider className="mt-10" />
        <ProfilePhotos />
      </main>
    </ProfilePageProvider>
  );
=======
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
>>>>>>> main
}
