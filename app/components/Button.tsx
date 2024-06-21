"use client";

import { IconType } from "react-icons";

interface ButtonProps {
  label: string;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  custom?: string;
  type?: "submit" | "reset" | "button" | undefined;
  icon?: IconType;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({
  label,
  disabled,
  outline,
  small,
  custom,
  type,
  icon: Icon,
  onClick,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`disabled:opacity-70 disabled:cursor-not-allowed rounded hover:opacity-80 transition w-full border-primaryColor flex items-center justify-center gap-2 active:scale-95
      ${outline ? "bg-white" : "bg-primaryColor"} 
      ${outline ? "text-primaryColor" : "text-white"}
      ${small ? "text-sm font-light" : "text-md font-semibold"} ${
        small ? "py-1 px-2 border-[1px]" : "py-3 px-4 border-2"
      }
      ${custom ? custom : ""}
      `}
    >
      {Icon && <Icon size={24} />}
      {label}
    </button>
  );
};

export default Button;
