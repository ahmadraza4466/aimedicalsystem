import { createChat, getChats } from "@/actions/chats";
import { cn } from "@/lib/utils";
import { Spinner } from "@nextui-org/spinner";
import { useEffect, useState } from "react";
import { BsStars } from "react-icons/bs";
import { FaRegEdit, FaGooglePlay, FaApple } from "react-icons/fa";

type ChatProps = {
  id: string;
  userId: string;
  name: string | null;
}[];

export default function Sidebar({ className }: { className?: string }) {
  const [prevChats, setPrevChats] = useState<ChatProps>();
  const [loading, setLoading] = useState(false);

  const createNewChat = async () => {
    await createChat();
    setPrevChats(await getChats());
  };

  useEffect(() => {
    setLoading(true);
    getChats().then((chats) => setPrevChats(chats));
    setLoading(false);
  }, []);
  return (
    <div
      className={cn(
        "absolute md:relative z-20 md:border-r md:dark:border-[#2A2929] md:border-[#B5B5B5]",
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
          <ul className="h-[55vh] md:h-[60vh] overflow-y-scroll scrollbar-thin scrollbar-thumb-primary">
            {loading ? (
              <Spinner />
            ) : prevChats?.length === 0 ? (
              <span className="flex justify-center text-gray-500">
                No previous chats 😟
              </span>
            ) : (
              prevChats?.map((chat) => (
                <li
                  key={chat.id}
                  className="text-sm md:text-xs truncate border border-[#C2C2C2] dark:border-[#1C1C1C] text-[#676D79] dark:text-[#F6F6F6] p-2 rounded-md mb-2 cursor-pointer active:scale-[98%] duration-75"
                >
                  {chat.name}
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
