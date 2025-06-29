/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Form } from "@heroui/form";
import { Textarea } from "@heroui/input";
import { Modal, ModalContent, ModalBody } from "@heroui/modal";
import { FaHeart } from "react-icons/fa";

export function ProfilePhotoModal() {
  return (
    <Modal isOpen={true} radius="none" size="5xl">
      <ModalContent>
        <ModalBody className="px-0 py-0 grid grid-cols-12 gap-0">
          <img
            alt="Profile"
            className="col-span-7 aspect-[4/5] object-cover"
            src="https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?cs=srgb&dl=pexels-souvenirpixels-414612.jpg&fm=jpg"
          />
          <div className="col-span-5 flex flex-col justify-between">
            <div className="flex flex-col gap-2 p-2">
              <div>jfsdfijasodfjioads</div>
              <div>jfsdfijasodfjioads</div>
              <div>jfsdfijasodfjioads</div>
            </div>
            <div className="p-2">
              <Divider className="mb-2" />
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <span className="flex gap-2 items-center">
                    <FaHeart className="text-2xl text-red-600" />
                    <p className="text-sm">Curtido por 100 pessoas</p>
                  </span>
                </div>
                <Form className="grid grid-cols-8">
                  <Textarea
                    key="new-comment"
                    className="col-span-6"
                    maxRows={5}
                    minRows={1}
                    placeholder="Escreva um comentário"
                    size="sm"
                    variant="underlined"
                  />
                  <Button
                    className="col-span-2"
                    size="sm"
                    type="submit"
                    variant="bordered"
                  >
                    Postar
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
