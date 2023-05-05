import React from "react";
import Image from "next/image";
import DefaultAvatar from "../public/images/avatar.webp";
import { ImageProps } from "next/image";

export interface NcImageProps extends ImageProps {
  containerClassName?: string;
}

const Avatar = ({
  size = "w-12 h-12",
  src = "",
}: {
  size?: string;
  src?: string | null | undefined;
}) => {
  return (
    <Image
      src={src ? src : DefaultAvatar}
      alt="Avatar"
      width={48}
      height={48}
      className={`${size} rounded-full object-cover`}
      priority
    />
  );
};

export default Avatar;
