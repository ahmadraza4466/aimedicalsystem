"use client";

import { refreshAccessToken } from "@/actions/auth";
import DownloadButton from "@/components/ui/download-btn";
import Logo from "@/components/ui/logo";
import Sidebar from "@/components/ui/sidebar";
import AccessTokenContextProvider, {
  AccessTokenContext,
} from "@/contexts/access-token-context";
import { SidebarContext } from "@/contexts/sidebar-context";
import { Input } from "@nextui-org/input";
import { useContext, useEffect, useRef } from "react";
import { BsUpload } from "react-icons/bs";

export default function Chats() {
  const { sidebar } = useContext(SidebarContext)!;
  useContext(AccessTokenContext);

  return (
    <AccessTokenContextProvider>
      <main className="md:flex md:items-center">
        <DownloadButton />

        <div>
          <Sidebar
            className={`duration-250 ${
              sidebar ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0`}
          />
        </div>
        <div className="flex flex-col justify-between h-[calc(100vh-10rem)] md:h-[calc(100vh-4rem)] md:w-full px-5">
          <div className="flex flex-col justify-center items-center h-[40vh] md:h-[60vh]">
            <Logo />
            <h1 className="font-bold text-lg">How can I help you today ?</h1>
          </div>

          <Input
            className="fixed md:relative bottom-7 md:bottom-0 w-[90%] md:w-[70%] self-center border dark:border-0 border-[#C2C2C2] rounded-xl"
            placeholder="Message AiBot ..."
            endContent={
              <BsUpload className="dark:bg-[#808080] dark:text-[#121212] bg-[#C2C2C2] w-7 h-7 p-1 rounded-sm active:scale-[95%] cursor-pointer" />
            }
          />
        </div>
      </main>
    </AccessTokenContextProvider>
  );
}
