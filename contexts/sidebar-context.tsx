"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

type ChatProps = {
  id: string;
  userId: string;
  name: string | null;
};

interface SidebarContextProps {
  sidebar: boolean;
  setSidebar: Dispatch<SetStateAction<boolean>>;
  chats: ChatProps[] | undefined;
  setChats: Dispatch<SetStateAction<ChatProps[] | undefined>>;
  selectedChat: ChatProps | undefined;
  setSelectedChat: Dispatch<SetStateAction<ChatProps | undefined>>;
  loading: {
    rowLoading: boolean;
    completeLoading: boolean;
  };
  setLoading: Dispatch<
    SetStateAction<{
      rowLoading: boolean;
      completeLoading: boolean;
    }>
  >;
}

export const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export default function SidebarContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebar, setSidebar] = useState(false);
  const [chats, setChats] = useState<ChatProps[]>();
  const [selectedChat, setSelectedChat] = useState<ChatProps>();
  const [loading, setLoading] = useState({
    rowLoading: false,
    completeLoading: false,
  });
  return (
    <SidebarContext.Provider
      value={{
        sidebar,
        setSidebar,
        chats,
        setChats,
        loading,
        setLoading,
        selectedChat,
        setSelectedChat,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
