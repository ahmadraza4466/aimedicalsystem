"use client";

import { refreshAccessToken } from "@/actions/auth";
import { ReactNode, createContext, useEffect, useState } from "react";

interface AccessTokenContextProps {
  //   accessToken: string;
}

export const AccessTokenContext = createContext<
  AccessTokenContextProps | undefined
>(undefined);

export default function AccessTokenContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    const tokenExpirationTime = 600000;
    const refreshInterval = setInterval(
      refreshAccessToken,
      tokenExpirationTime
    );

    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <AccessTokenContext.Provider value={{}}>
      {children}
    </AccessTokenContext.Provider>
  );
}
