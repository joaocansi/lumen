import { headers } from "next/headers";

import { authClient } from "@/config/auth";
import { SessionProvider } from "@/hooks/useSession";
import { SWRConfig } from "swr";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Lumen - Compartilhe sua luz com o mundo!",
    template: "%s - Lumen",
  },
};

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
  return (
    <SessionProvider sessionProfile={session}>
      <SWRConfig value={{ revalidateOnFocus: false }}>{children}</SWRConfig>
    </SessionProvider>
  );
}
