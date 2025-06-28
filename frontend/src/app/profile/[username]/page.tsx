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
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
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
}
