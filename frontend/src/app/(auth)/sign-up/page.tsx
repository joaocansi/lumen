import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="w-[90%] max-w-lg mx-auto h-full min-h-screen flex flex-col items-center justify-center -mb-8">
      <div className="w-full">
        <h1 className="text-4xl font-black">Criar Conta</h1>
        <p className="mt-">Insira seus dados para criar sua conta.</p>
      </div>

      <Form className="mt-5 w-full flex flex-col gap-4">
        <Input isRequired id="name" label="Nome" name="name" />
        <Input isRequired id="email" label="Email" name="email" type="email" />

        <div className="flex flex-col md:flex-row gap-3 w-full">
          <Input
            isRequired
            className="w-full"
            id="username"
            label="Nome de usuário"
            name="username"
          />
          <Input
            isRequired
            className="w-full"
            id="password"
            label="Senha"
            name="password"
            type="password"
          />
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
            color="success"
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
