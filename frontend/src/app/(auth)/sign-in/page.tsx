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

const SignInSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Insira um email válido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

async function signIn(email: string, password: string): Promise<boolean> {
  const result = await authClient.signIn.email({ email, password });

  if (!result.error) {
    toast.success("Login realizado com sucesso!");
    return true;
  }

  if (result.error.status === 401) {
    toast.error("E-mail ou senha não correspondem a uma conta existente.");
    return false;
  }

  toast.error("Não foi possível realizar o login. Tente novamente mais tarde.");
  return false;
}

export default function SignInPage() {
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleSignIn = async (e: any) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    let data = Object.fromEntries(formData);

    const parsedData = SignInSchema.safeParse(data);

    if (!parsedData.success) {
      const errors = parseFormError(parsedData.error);
      setErrors(errors);
      return;
    }

    const hasSignedIn = await signIn(
      parsedData.data.email,
      parsedData.data.password,
    );

    if (hasSignedIn) {
      window.location.href = "/";
    }
  };

  return (
    <div className="w-[90%] max-w-lg mx-auto overflow-auto flex flex-col items-center justify-center -mb-8">
      <div className="w-full">
        <h1 className="text-4xl font-black">Login</h1>
        <p className="mt-1">
          Insira seus dados para entrar na sua conta ou crie uma conta agora.
        </p>
      </div>
      <Form
        className="mt-5 w-full flex flex-col gap-4"
        validationErrors={errors}
        onSubmit={handleSignIn}
      >
        <Input
          isRequired
          label="E-mail"
          name="email"
          type="email"
          variant="flat"
        />
        <Input
          isRequired
          label="Senha"
          name="password"
          type="password"
          variant="flat"
        />
        <div className="w-full flex gap-2">
          <Button
            fullWidth
            color="primary"
            size="lg"
            type="submit"
            variant="solid"
          >
            Entrar
          </Button>
          <Button
            fullWidth
            as={Link}
            className="text-white bg-green-600 hover:bg-green-700"
            href="/sign-up"
            size="lg"
            variant="solid"
          >
            Ainda não tenho conta
          </Button>
        </div>
      </Form>
    </div>
  );
}
