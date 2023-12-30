import { cn } from "@/lib/utils";
import { BsStars } from "react-icons/bs";

export default function Logo({ className }: { className?: string }) {
  return (
    <BsStars
      className={cn(
        "text-4xl dark:bg-white dark:text-[#121212] bg-[#E8EAEE] text-[#2D374C] w-16 h-16 p-3 rounded-full mb-3",
        className
      )}
    />
  );
}
