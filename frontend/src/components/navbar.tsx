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
import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { ThemeSwitch } from "./theme-switch";
import { UploadPhotoModal } from "./upload-photo-modal";

import { useSession } from "@/hooks/useSession";
import { authClient } from "@/config/auth";
import { FaSignOutAlt, FaUser } from "react-icons/fa";

export function Navbar() {
  const { sessionProfile } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  function handleModalClose() {
    setIsOpen(false);
  }

  function handleModalOpen() {
    if (!sessionProfile) {
      toast.error("Você precisa estar logado para fazer isso");
      return;
    }

    setIsOpen(true);
  }

  async function signOut() {
    toast.promise(authClient.signOut(), {
      loading: "Deslogando...",
      success: () => {
        router.push("/sign-in");
        return "Deslogado com sucesso";
      },
      error: "Não foi possível deslogar da conta",
    });
  }

  return (
    <div className="py-4">
      <nav className="flex justify-between items-center max-w-4xl mx-auto w-[90%]">
        <div className="flex gap-4 justify-center items-center">
          <Link href="/">
            <h1 className="flex text-lg font-bold items-center gap-2">
              <img
                alt="lumen"
                className="w-7 h-7 dark:brightness-0 dark:invert"
                src="/logo.png"
              />
              Lumen
            </h1>
          </Link>
          <Button color="primary" size="sm" onPress={handleModalOpen}>
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
                  <div className="flex flex-row items-center gap-2">
                    <FaUser />
                    <span>Meu perfil</span>
                  </div>
                </DropdownItem>
                <DropdownItem key="logout" color="danger" onPress={signOut}>
                  <div className="flex flex-row items-center gap-2">
                    <FaSignOutAlt />
                    <span>Sair</span>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
              <Button as={Link} color="default" href="/sign-in" size="sm">
              Entrar
            </Button>
          )}
        </div>
      </nav>
      <UploadPhotoModal isOpen={isOpen} onClose={handleModalClose} />
    </div>
  );
}
