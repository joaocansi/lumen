/* eslint-disable @next/next/no-img-element */
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input, Textarea } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { useState } from "react";
import toast from "react-hot-toast";

import { api } from "@/config/axios";

type UploadPhotoModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function UploadPhotoModal({ isOpen, onClose }: UploadPhotoModalProps) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handlePublish = async () => {
    if (!photo) {
      toast.error("Selecione uma imagem");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", photo);
      formData.append("caption", caption);

      await api.post("/photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Imagem publicada com sucesso.");
      resetForm();
      onClose();
    } catch {
      toast.error("Não foi possível publicar imagem.");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setPhoto(null);
    setCaption("");
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Publicar Imagem
            </ModalHeader>
            <ModalBody>
              <Form>
                <Input
                  accept="image/jpg"
                  label="Selecione uma imagem"
                  type="file"
                  onChange={handleFileChange}
                />

                {previewUrl && (
                  <div className="mt-4">
                    <img
                      alt="Preview"
                      className="max-w-full max-h-48 rounded-lg object-cover"
                      src={previewUrl}
                    />
                  </div>
                )}

                <Textarea
                  label="Legenda"
                  maxRows={6}
                  minRows={3}
                  placeholder="Digite uma legenda"
                  rows={3}
                  value={caption}
                  variant="flat"
                  onChange={(e) => setCaption(e.target.value)}
                />
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                disabled={isUploading}
                variant="light"
                onPress={handleClose}
              >
                Fechar
              </Button>
              <Button
                color="primary"
                disabled={!photo || isUploading}
                isLoading={isUploading}
                onPress={handlePublish}
              >
                {isUploading ? "Publicando..." : "Publicar"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
