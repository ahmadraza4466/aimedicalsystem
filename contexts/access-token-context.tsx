"use client";

import { ReactNode, createContext, useEffect, useState } from "react";

interface AccessTokenContextProps {}

export const AccessTokenContext = createContext<
  AccessTokenContextProps | undefined
>(undefined);

export default function AccessTokenContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const refreshAccessToken = async () => {
    const res = await fetch("/api/auth/refresh-token").then((res) =>
      res.json()
    );
    return res.token;
  };

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
