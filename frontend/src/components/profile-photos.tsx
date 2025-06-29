/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */

import { FaHeart } from "react-icons/fa";
import { FaComment } from "react-icons/fa6";

import { ProfilePhotoModal } from "./profile-photo-modal";

type ProfilePhotoProps = {
  src: string;
};

function ProfilePhoto(data: ProfilePhotoProps) {
  return (
    <div className="relative w-full h-full col-span aspect-[9/10] cursor-pointer">
      <img
        className="w-full h-full object-cover aspect-[9/10]"
        src={data.src}
      />
      <div className="absolute w-full h-full top-0 group">
        <div className="bg-black opacity-0 group-hover:opacity-45 transition-opacity w-full h-full absolute top-0 left-0" />
        <div className="bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity w-full h-full absolute top-0 left-0 flex items-center justify-center gap-4">
          <span className="text-lg text-white flex items-center gap-1">
            <FaHeart /> 100
          </span>
          <span className="text-lg text-white flex items-center gap-1">
            <FaComment /> 12
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePhotos() {
  const images = [
    "https://conteudo.imguol.com.br/c/noticias/e9/2022/03/05/o-deputado-estadual-arthur-do-val-podemos-sp-1646488780316_v2_450x450.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmlnzwTj0VNjVOM-PUd_ZUZOTp5VO5si1Whw&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD6x41zGeY5vSBlsPNaxv4DFippGdUm2Di0w&s",
    "https://static.poder360.com.br/2022/03/arthur-do-val-mamae-falei-848x477.png",
  ];

  return (
    <div className="w-full grid grid-cols-3 gap-4 mt-4">
      {images.map((item, index) => (
        <ProfilePhoto key={`profile-${index}`} src={item} />
      ))}
      <ProfilePhotoModal />
    </div>
  );
}

{
  /* <img
        className="w-full h-full object-cover col-span-1 aspect-[9/10]"
        src="https://conteudo.imguol.com.br/c/noticias/e9/2022/03/05/o-deputado-estadual-arthur-do-val-podemos-sp-1646488780316_v2_450x450.png"
      />
      <img
        className="w-full h-full object-cover col-span-1 aspect-[9/10]"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmlnzwTj0VNjVOM-PUd_ZUZOTp5VO5si1Whw&s"
      />
      <img
        className="w-full h-full object-cover col-span-1 aspect-[9/10]"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD6x41zGeY5vSBlsPNaxv4DFippGdUm2Di0w&s"
      />
      <img
        className="w-full h-full object-cover col-span-1 aspect-[9/10]"
        src="https://static.poder360.com.br/2022/03/arthur-do-val-mamae-falei-848x477.png"
      /> */
}
