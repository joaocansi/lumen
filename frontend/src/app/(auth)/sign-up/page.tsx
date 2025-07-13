"use client";

import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import Link from "next/link";
import { z } from "zod";
import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/config/auth";
import { parseFormError } from "@/utils/parse-form-error";

const SignUpSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Insira um email válido"),
  username: z.string().min(1, "Nome de usuário é obrigatório"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  profileImageUrl: z.string().optional(),
});

async function signUp(
  name: string,
  email: string,
  username: string,
  password: string,
  profileImageUrl?: string,
): Promise<boolean> {
  try {
    const result = await authClient.signUp.email({
      email,
      password,
      name,
      username,
      image: profileImageUrl || "",
    });

    if (!result.error) {
      toast.success("Conta criada com sucesso!");
      return true;
    }

    if (result.error.status === 409) {
      toast.error("Email ou nome de usuário já está em uso.");
      return false;
    }

    toast.error("Não foi possível criar a conta. Tente novamente mais tarde.");
    return false;
  } catch (error) {
    toast.error("Erro inesperado. Tente novamente mais tarde.");
    return false;
  }
}

export default function SignUpPage() {
  const [errors, setErrors] = useState({});
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [isImageValid, setIsImageValid] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: any) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    let data = Object.fromEntries(formData);

    const parsedData = SignUpSchema.safeParse(data);

    if (!parsedData.success) {
      const errors = parseFormError(parsedData.error);
      setErrors(errors);
      return;
    }

    const hasSignedUp = await signUp(
      parsedData.data.name,
      parsedData.data.email,
      parsedData.data.username,
      parsedData.data.password,
      parsedData.data.profileImageUrl,
    );

    if (hasSignedUp) {
      router.push("/sign-in");
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setProfileImageUrl(url);

    if (url) {
      const img = new window.Image();
      img.onload = () => setIsImageValid(true);
      img.onerror = () => setIsImageValid(false);
      img.src = url;
    } else {
      setIsImageValid(false);
    }
  };

  return (
    <div className="w-[90%] max-w-lg mx-auto overflow-auto flex flex-col items-center justify-center -mb-8">
      <div className="w-full">
        <h1 className="text-4xl font-black">Criar Conta</h1>
        <p className="mt-1">Insira seus dados para criar sua conta.</p>
      </div>

      <Form
        className="mt-5 w-full flex flex-col gap-4"
        validationErrors={errors}
        onSubmit={handleSignUp}
      >
        <Input
          isRequired
          id="name"
          label="Nome"
          name="name"
          variant="flat"
        />
        <Input
          isRequired
          id="email"
          label="Email"
          name="email"
          type="email"
          variant="flat"
        />

        <div className="flex flex-col md:flex-row gap-3 w-full">
          <Input
            isRequired
            className="w-full"
            id="username"
            label="Nome de usuário"
            name="username"
            variant="flat"
          />
          <Input
            isRequired
            className="w-full"
            id="password"
            label="Senha"
            name="password"
            type="password"
            variant="flat"
          />
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Input
            className="w-full"
            id="profileImageUrl"
            label="URL da imagem de perfil (opcional)"
            name="profileImageUrl"
            type="url"
            variant="flat"
            placeholder="https://exemplo.com/imagem.jpg"
            onChange={handleProfileImageChange}
          />

          {profileImageUrl && (
            <div className="flex flex-col items-center gap-2">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
                {isImageValid ? (
                  <img
                    src={profileImageUrl}
                    alt="Preview da imagem de perfil"
                    className="w-full h-full object-cover"
                    onError={() => setIsImageValid(false)}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-xs text-center">
                      Imagem inválida
                    </span>
                  </div>
                )}
              </div>
              {!isImageValid && profileImageUrl && (
                <p className="text-red-500 text-sm">
                  URL da imagem inválida
                </p>
              )}
            </div>
          )}
        </div>

        <div className="w-full flex flex-col md:flex-row mt-2 gap-2">
          <Button
            fullWidth
            color="primary"
            size="lg"
            type="submit"
            variant="solid"
          >
            Criar Conta
          </Button>
          <Button
            fullWidth
            as={Link}
            className="text-white bg-green-600 hover:bg-green-700"
            href="/sign-in"
            size="lg"
            variant="solid"
          >
            Já tenho conta
          </Button>
        </div>
      </Form>
    </div>
  );
}
