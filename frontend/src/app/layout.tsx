import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { Toaster } from "react-hot-toast";

import { Providers } from "./providers";
import { getSession } from "./profile/layout";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { SessionProvider } from "@/hooks/useSession";

export const metadata: Metadata = {
  title: {
    default: "Lumen - Compartilhe sua luz com o mundo!",
    template: "%s - Lumen",
  },
  description: siteConfig.description,
  icons: {
    icon: "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers
          themeProps={{
            attribute: "class",
            defaultTheme: "light",
            // forcedTheme: "light",
          }}
        >
          <SessionProvider sessionProfile={session}>{children}</SessionProvider>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
