import { SidebarContext } from "@/contexts/sidebar-context";
import { cn } from "@/lib/utils";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Skeleton,
} from "@nextui-org/react";
import { Spinner } from "@nextui-org/spinner";
import { useContext, useEffect, useState } from "react";
import { BsStars } from "react-icons/bs";
import { FaRegEdit, FaGooglePlay, FaApple, FaEllipsisV } from "react-icons/fa";

export default function Sidebar({ className }: { className?: string }) {
  const {
    chats,
    setChats,
    loading,
    setLoading,
    selectedChat,
    setSelectedChat,
  } = useContext(SidebarContext)!;

  const createNewChat = async () => {
    setSelectedChat(undefined);
  };

  const getChats = async () => {
    const res = await fetch("/api/chat").then((res) => res.json());
    return res.chats;
  };

  useEffect(() => {
    setLoading({ ...loading, completeLoading: true });
    getChats().then((chats) => setChats(chats!));
    setLoading({ ...loading, completeLoading: false });
  }, []);

  return (
    <div
      className={cn(
        "fixed top-16 md:top-0 md:border-r md:dark:border-[#2A2929] md:border-[#B5B5B5] z-50",
        className
      )}
    >
      <div className="h-[calc(100vh-4rem)] md:min-h-screen w-[80vw] md:w-[20vw] dark:bg-[#121212] bg-[#F8F9FA] p-4 flex flex-col justify-between">
        <div>
          <button
            className="w-full py-2 px-4 outline-none text-sm rounded-md dark:text-[#3395FF] dark:bg-[#15222E] bg-[#E8EAEE] border dark:border-0 border-[#C2C2C2] flex justify-between items-center active:scale-[98%] duration-100 mb-7"
            onClick={createNewChat}
          >
            <span className="flex items-center">
              <BsStars className="mr-4" />
              New Chat
            </span>
            <FaRegEdit />
          </button>
          <ul className="h-[55vh] md:h-[60vh] overflow-y-auto scrollbar-thin dark:scrollbar-thumb-primary scrollbar-thumb-[#2D374C]">
            {loading.rowLoading ? (
              <Skeleton className="rounded-md mb-2 text-sm md:text-xs p-3" />
            ) : null}
            {loading.completeLoading ? (
              <ChatSkeleton />
            ) : chats?.length === 0 ? (
              <span className="flex justify-center text-gray-500">
                No previous chats 😟
              </span>
            ) : (
              chats?.map((chat) => (
                <li
                  onClick={() => setSelectedChat(chat)}
                  key={chat.id}
                  className={cn(
                    "relative flex justify-between items-center text-sm md:text-xs truncate border border-[#C2C2C2] dark:border-[#1C1C1C] text-[#676D79] dark:text-[#F6F6F6] p-2 rounded-md mb-2 cursor-pointer active:scale-[98%] duration-75",
                    selectedChat?.id === chat.id
                      ? "bg-[#C2C2C2] dark:bg-[#1C1C1C]"
                      : null
                  )}
                >
                  <p className="overflow-x-hidden text-ellipsis whitespace-nowrap">
                    {chat.name}
                  </p>
                  {/* <div className="relative">
                    <Dropdown className="absolute top-0">
                      <DropdownTrigger>
                        <FaEllipsisV className="" />
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem>Rename</DropdownItem>
                        <DropdownItem className="text-[#ce3939] hover:bg-[#7e28286e]">
                          Delete
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div> */}
                </li>
              ))
            )}
          </ul>
        </div>
        <div>
          <button className="w-full py-2 px-4 outline-none text-sm rounded-md dark:text-[#FFFFFF] dark:bg-[#000000] text-[#000000] bg-[#E8EAEE] border-[0.7px] border-[#FFFFFF] flex items-center active:scale-[98%] mb-2">
            <BsStars className="mr-4 text-lg" />
            <p className="md:text-xs">Upgrade your plan</p>
          </button>
          <button className="w-full py-2 px-4 outline-none text-sm rounded-md dark:text-[#FFFFFF] dark:bg-[#000000] text-[#000000] bg-[#E8EAEE] border-[0.7px] border-[#FFFFFF] flex items-center active:scale-[98%] mb-2">
            <FaGooglePlay className="mr-4 text-lg" />
            <p className="md:text-xs">Get it on Google play</p>
          </button>
          <button className="w-full py-2 px-4 outline-none text-sm rounded-md dark:text-[#FFFFFF] dark:bg-[#000000] text-[#000000] bg-[#E8EAEE] border-[0.7px] border-[#FFFFFF] flex items-center active:scale-[98%]">
            <FaApple className="mr-4 text-lg" />
            <p className="md:text-xs">Download on App Store</p>
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatSkeleton() {
  return (
    <div>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="rounded-md mb-2 text-sm md:text-xs p-3" />
      ))}
    </div>
  );
}
