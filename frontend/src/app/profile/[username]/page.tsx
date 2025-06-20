import { notFound } from "next/navigation";

import { ProfileHeader } from "@/components/profileHeader";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/";

async function getProfile(username: string) {
  const res = await fetch(`${API_URL}/profile/username/${username}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }

  return res.json();
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getProfile(username);

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <ProfileHeader profile={profile} />
    </main>
  );
}
