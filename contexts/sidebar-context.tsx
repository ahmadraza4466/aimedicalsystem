"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

interface SidebarContextProps {
  sidebar: boolean;
  setSidebar: Dispatch<SetStateAction<boolean>>;
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
  return (
    <SidebarContext.Provider value={{ sidebar, setSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}
