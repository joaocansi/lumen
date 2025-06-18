import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="w-[90%] max-w-lg mx-auto h-full min-h-screen flex flex-col items-center justify-center -mb-8">
      <div className="w-full">
        <h1 className="text-4xl font-black">Login</h1>
        <p className="mt-1">
          Insira seus dados para entrar na sua conta ou crie uma conta agora.
        </p>
      </div>
      <Form className="mt-5 w-full flex flex-col gap-4">
        <Input isRequired label="Nome de usuário" type="email" variant="flat" />
        <Input isRequired label="Senha" type="password" variant="flat" />
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
            color="success"
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
