"use client";

import { authClient } from "@/config/auth";

export default function Home() {
  const session = authClient.useSession();
  if (session.isPending) return <div>Loading...</div>;

  return (
    <div>
      <h1>fahsdioufhd</h1>
    </div>
  );
}
