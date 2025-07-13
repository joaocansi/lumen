import Image from "next/image";

import { ThemeSwitch } from "@/components/theme-switch";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full min-h-screen grid grid-cols-2 max-lg:grid-cols-1">
      <div className="w-full col-span-1 h-full flex flex-col items-center justify-between">
        <div className="flex justify-between w-full px-4 pt-2">
          <h1 className="flex text-2xl font-black gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                alt="lumen"
                className="dark:brightness-0 dark:invert"
                height={32}
                src="/logo.png"
                width={32}
              />
              Lumen
            </Link>
          </h1>
          <ThemeSwitch />
        </div>

        <div className="w-full flex-1 flex items-center justify-center">
          {children}
        </div>

        <div />
      </div>

      <div className="w-full col-span-1 h-full flex items-center justify-center flex-col bg-[url(/background.jpg)] bg-cover bg-center max-lg:hidden" />
    </div>
  );
}
