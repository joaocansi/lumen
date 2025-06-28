import { headers } from "next/headers";

import { authClient } from "@/config/auth";
import { SessionProvider } from "@/hooks/useSession";

export const getSession = async () => {
  try {
    const session = await authClient.getSession({
      fetchOptions: {
        headers: await headers(),
      },
    });
    if (session.data) return session.data.user;
    return null;
  } catch {
    return null;
  }
};

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return <SessionProvider sessionProfile={session}>{children}</SessionProvider>;
}
