"use client";

import { getUserDetails } from "@/actions/auth";
import { getChats } from "@/actions/chats";
import { askLLM, generateChatName, getChatMessages } from "@/actions/llm";
import DownloadButton from "@/components/ui/download-btn";
import Logo from "@/components/ui/logo";
import Sidebar from "@/components/ui/sidebar";
import AccessTokenContextProvider, {
  AccessTokenContext,
} from "@/contexts/access-token-context";
import { SidebarContext } from "@/contexts/sidebar-context";
import { Avatar } from "@nextui-org/avatar";
import { Input } from "@nextui-org/input";
import { Skeleton } from "@nextui-org/react";
import { useContext, useEffect, useRef, useState } from "react";
import { BsUpload } from "react-icons/bs";

type UserDetailsProps = {
  id: string;
  email: string;
  avatarUrl: string;
};

export default function Chats() {
  useContext(AccessTokenContext);
  const {
    sidebar,
    chats,
    setChats,
    setLoading,
    selectedChat,
    setSelectedChat,
  } = useContext(SidebarContext)!;
  const [inputPrompt, setInputPrompt] = useState("");
  const [userDetails, setUserDetails] = useState<UserDetailsProps>();
  const [messages, setMessages] = useState<{ content: string }[]>([]);
  const [contentLoading, setContentLoading] = useState(false);
  const messageEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    getUserDetails().then((details) => setUserDetails(details));
  }, []);

  useEffect(() => {
    if (selectedChat) {
      getChatMessages({ id: selectedChat.id }).then((res) => setMessages(res));
    }
  }, [selectedChat]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <AccessTokenContextProvider>
      <main className="md:flex md:items-center md:justify-between">
        <DownloadButton />

        <div>
          <Sidebar
            className={`duration-250 ${
              sidebar ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0`}
          />
        </div>
        <div
          id="messageBody"
          className="flex flex-col justify-between items-center h-[calc(100vh-10rem)] md:h-[calc(100vh-4rem)] md:w-[80vw] px-5"
        >
          {!selectedChat || (!contentLoading && messages?.length === 0) ? (
            <div className="flex flex-col justify-center items-center h-[40vh] md:h-[60vh]">
              <Logo />
              <h1 className="font-bold text-lg">How can I help you today ?</h1>
            </div>
          ) : (
            <ul className="py-28 w-full md:w-[70%]">
              {messages?.map((message, i) => (
                <li className="mb-4" key={i}>
                  {i % 2 === 0 ? (
                    <div className="flex items-center gap-x-2">
                      <Avatar
                        className="flex-nowrap"
                        size="sm"
                        color="primary"
                        src={userDetails?.avatarUrl}
                      />
                      <h4>You</h4>
                    </div>
                  ) : (
                    <div className="flex items-center gap-x-2">
                      <Logo className="w-8 h-8 p-2" />
                      <h4>AiBot</h4>
                    </div>
                  )}
                  <p className="text-sm ml-11">{message.content}</p>
                </li>
              ))}
              {contentLoading ? (
                <li className="mb-4">
                  <div className="flex items-center gap-x-2">
                    <Logo className="w-8 h-8 p-2" />
                    <h4>AiBot</h4>
                  </div>
                  <Skeleton className="rounded-lg mb-1">
                    <p className="flex h-3" />
                  </Skeleton>
                  <Skeleton className="rounded-lg">
                    <p className="flex h-3" />
                  </Skeleton>
                </li>
              ) : null}
              <div ref={messageEndRef} />
            </ul>
          )}

          <Input
            className="fixed bottom-7 w-[90%] md:w-[55%] self-center border dark:border-0 border-[#C2C2C2] rounded-xl"
            placeholder="Message AiBot ..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            endContent={
              <BsUpload
                type="submit"
                className="dark:bg-[#808080] dark:text-[#121212] bg-[#C2C2C2] w-7 h-7 p-1 rounded-sm active:scale-[95%] cursor-pointer"
                onClick={async () => {
                  if (!selectedChat) {
                    setLoading({ rowLoading: true, completeLoading: false });
                    await generateChatName({ prompt: inputPrompt });

                    setChats(await getChats());
                    console.log(chats);
                    new Promise((res) => setTimeout(res, 2000));
                    setLoading({ rowLoading: false, completeLoading: false });
                    setSelectedChat(chats![0]);
                    console.log(selectedChat);
                  }
                  if (!messages) setMessages([{ content: inputPrompt }]);
                  else setMessages([...messages, { content: inputPrompt }]);
                  setContentLoading(true);
                  await askLLM({
                    chatId: chats![0].id,
                    prompt: inputPrompt,
                  });
                  await getChatMessages({ id: chats![0].id }).then((res) =>
                    setMessages(res)
                  );
                  setContentLoading(false);
                  // if (!selectedChat) {
                  //   setLoading({ rowLoading: true, completeLoading: false });
                  //   await generateChatName({ prompt: inputPrompt });
                  //   setChats(await getChats());
                  //   setSelectedChat((selectedChat) => chats![0]);
                  //   console.log(selectedChat);
                  //   setLoading({ rowLoading: false, completeLoading: false });
                  //   setMessages([{ content: inputPrompt }]);
                  // } else {
                  //   setMessages([...messages!, { content: inputPrompt }]);
                  //   setContentLoading(true);
                  //   console.log(selectedChat);
                  //   console.log(`SELECTED CHAT'S ID: ${selectedChat!.id}`);
                  //   await askLLM({
                  //     chatId: selectedChat!.id,
                  //     prompt: inputPrompt,
                  //   });
                  //   await getChatMessages({ id: selectedChat!.id }).then(
                  //     (res) => setMessages(res)
                  //   );
                  //   setContentLoading(false);
                  // }
                }}
              />
            }
          />
        </div>
      </main>
    </AccessTokenContextProvider>
  );
}
