"use client";

import { cn } from "@/lib/utils";
import { Spinner } from "@nextui-org/spinner";

type SubmitButtonProps = {
  text: string;
  loading: boolean;
  requestSuccessful: boolean;
  successMessage: string;
};

export default function SubmitButton({
  text,
  loading,
  requestSuccessful,
  successMessage,
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className={cn(
        "w-full bg-[#15222E] text-[#3395FF] border border-[#2A2929] p-2 rounded-lg active:scale-95 duration-100",
        requestSuccessful ? "bg-green-600 text-white duration-100" : null
      )}
    >
      {loading ? (
        <Spinner size="sm" />
      ) : requestSuccessful ? (
        successMessage
      ) : (
        text
      )}
    </button>
  );
}
