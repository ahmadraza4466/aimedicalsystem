"use client";

import { cn } from "@/lib/utils";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { ChangeEventHandler, useState } from "react";

type InputProps = {
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
  startContent?: any;
  endContent?: boolean;
  placeholder?: string;
  type?: string;
  className?: string;
  required?: boolean;
};

export default function Input({
  onChange,
  startContent,
  endContent = false,
  placeholder,
  type,
  className,
  required = false,
}: InputProps) {
  const [showPass, setShowPass] = useState(false);
  return (
    <div
      className={cn(
        "flex items-center w-full rounded-lg bg-[#121212] border border-[#2A2929]",
        className
      )}
    >
      {startContent ? startContent : null}
      <input
        onChange={onChange}
        type={
          type !== "text-or-password"
            ? type
            : `${showPass ? "text" : "password"}`
        }
        required={required}
        placeholder={placeholder}
        className="w-full bg-transparent p-2 outline-none"
      />
      {endContent ? (
        showPass ? (
          <FaRegEye
            className="pr-2 text-3xl"
            onClick={() => setShowPass(false)}
          />
        ) : (
          <FaRegEyeSlash
            className="pr-2 text-3xl"
            onClick={() => setShowPass(true)}
          />
        )
      ) : null}
    </div>
  );
}
