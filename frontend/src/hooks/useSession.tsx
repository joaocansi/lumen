"use client";

import { useEffect, useState } from "react";

import { authClient } from "@/config/auth";

export function useSession() {
  const [session, setSession] = useState<Awaited<
    ReturnType<typeof authClient.getSession>
  > | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      const session = await authClient.getSession();
      setSession(session);
    };

    loadSession();
  }, []);

  return { session };
}
