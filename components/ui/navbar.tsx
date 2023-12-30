"use client";

import { BiMenuAltLeft } from "react-icons/bi";
import ThemeSwitcher from "../theme-switcher";
import { Righteous } from "next/font/google";
import { Divider } from "@nextui-org/divider";
import { useContext } from "react";
import LangSwitcher from "./lang-switcher";
import { cn } from "@/lib/utils";
import { SidebarContext } from "@/contexts/sidebar-context";
import { usePathname } from "next/navigation";
import UserAvatar from "./user-avatar";

const righteous = Righteous({ subsets: ["latin"], weight: ["400"] });

export default function Navbar() {
  const { sidebar, setSidebar } = useContext(SidebarContext)!;
  const path = usePathname();
  if (path.includes("/auth")) {
    return null;
  }
  return (
    <nav className="w-full md:fixed md:w-[80%] md:right-0">
      <div className="flex justify-between items-center px-5 h-16">
        <BiMenuAltLeft
          className="text-2xl md:hidden"
          onClick={() => setSidebar(!sidebar)}
        />
        <h2 className={`${righteous.className} text-2xl`}>AiBot</h2>
        <div className="flex items-center">
          <LangSwitcher className="mr-2" />
          <ThemeSwitcher />
          <UserAvatar className="ml-3 cursor-pointer" />
        </div>
      </div>
      <Divider />
      <div
        className={cn(
          "md:hidden duration-250 fixed w-screen h-full bg-black opacity-80 z-10",
          !sidebar ? "hidden" : "",
          "md:hidden"
        )}
        onClick={() => setSidebar(false)}
      />
    </nav>
  );
}
