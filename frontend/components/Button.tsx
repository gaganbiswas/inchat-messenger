import React, { ButtonHTMLAttributes } from "react";
import { ButtonLoader } from "./Icons";

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  label: string;
}

const Button = ({ loading, label, ...props }: IButtonProps) => {
  return (
    <button
      disabled={loading}
      className="py-2 px-4 bg-blue-500 rounded-md text-white font-semibold min-h-[42px] flex items-center justify-center disabled:bg-gray-400"
      {...props}
    >
      {loading ? <ButtonLoader /> : label}
    </button>
  );
};

export default Button;
