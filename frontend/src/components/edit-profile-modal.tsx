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
import { useState, useEffect } from "react";
import { useProfilePage } from "@/hooks/useProfilePage";
import { Profile, ProfileWithMetadataAndSessionInfo } from "@/types";

export type EditProfileModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { name: string; bio: string; image: string }) => Promise<void> | void;
    isSaving?: boolean;
};

export function EditProfileModal({
    isOpen,
    onClose,
    onSave,
    isSaving = false,
}: EditProfileModalProps) {
    const { profile, setProfile } = useProfilePage();
    const [name, setName] = useState(profile.name);
    const [bio, setBio] = useState(profile.bio || "");
    const [profileImageUrl, setProfileImageUrl] = useState(profile.avatarUrl || "");
    const [previewUrl, setPreviewUrl] = useState<string>(profile.avatarUrl || "");
    const [isImageValid, setIsImageValid] = useState(true);

    useEffect(() => {
        setName(profile.name);
        setBio(profile.bio || "");
        setProfileImageUrl(profile.avatarUrl || "");
        setPreviewUrl(profile.avatarUrl || "");
        setIsImageValid(true);
    }, [isOpen, profile.name, profile.bio, profile.avatarUrl]);

    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setProfileImageUrl(url);
        setPreviewUrl(url);
        if (url) {
            const img = new window.Image();
            img.onload = () => setIsImageValid(true);
            img.onerror = () => setIsImageValid(false);
            img.src = url;
        } else {
            setIsImageValid(true);
        }
    };

    const handleSave = async () => {
        await onSave({ name, bio, image: profileImageUrl });
        setProfile((prev: ProfileWithMetadataAndSessionInfo) => ({
            ...prev,
            name,
            bio,
            avatarUrl: profileImageUrl,
        }));
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Editar Perfil
                        </ModalHeader>
                        <ModalBody>
                            <Form>
                                <Input
                                    label="Nome"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    isRequired
                                />
                                <Textarea
                                    label="Bio"
                                    maxRows={6}
                                    minRows={3}
                                    placeholder="Digite uma bio"
                                    rows={3}
                                    value={bio}
                                    variant="flat"
                                    onChange={(e) => setBio(e.target.value)}
                                />
                                <Input
                                    label="URL da imagem de perfil"
                                    type="url"
                                    value={profileImageUrl}
                                    onChange={handleProfileImageChange}
                                    placeholder="https://exemplo.com/imagem.jpg"
                                />
                                {previewUrl && (
                                    <div className="mt-4 flex flex-col items-center gap-2">
                                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
                                            {isImageValid ? (
                                                <img
                                                    src={previewUrl}
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
                                        {!isImageValid && previewUrl && (
                                            <p className="text-red-500 text-sm">
                                                URL da imagem inválida
                                            </p>
                                        )}
                                    </div>
                                )}
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                disabled={isSaving}
                                variant="light"
                                onPress={handleClose}
                            >
                                Cancelar
                            </Button>
                            <Button
                                color="primary"
                                disabled={isSaving || !name}
                                isLoading={isSaving}
                                onPress={handleSave}
                            >
                                Salvar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
} 