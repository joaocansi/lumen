"use client";

/* eslint-disable @next/next/no-img-element */
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import Link from "next/link";

import { ThemeSwitch } from "./theme-switch";

import { useSession } from "@/hooks/useSession";

export function Navbar() {
  const { sessionProfile } = useSession();

  return (
    <div className="py-4">
      <nav className="flex justify-between items-center max-w-4xl mx-auto w-[90%]">
        <div className="flex gap-4 justify-center items-center">
          <h1 className="flex text-lg font-bold items-center gap-2">
            <img
              alt="lumen"
              className="w-7 h-7 dark:brightness-0 dark:invert"
              src="/logo.png"
            />
            Lumen
          </h1>
          <Button color="primary" size="sm">
            + publicar foto
          </Button>
        </div>
        <div className="flex gap-2">
          <ThemeSwitch />

          {sessionProfile ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  showFallback
                  className="cursor-pointer"
                  src={sessionProfile.image ?? undefined}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem
                  key="my-profile"
                  as={Link}
                  href={`/profile/${sessionProfile.username}`}
                >
                  Meu perfil
                </DropdownItem>
                <DropdownItem key="logout" color="danger">
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button color="default" size="sm">
              Entrar
            </Button>
          )}
        </div>
      </nav>
    </div>
  );
}
