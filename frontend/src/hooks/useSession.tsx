"use client";

import { createContext, useContext } from "react";

import { SessionProfile } from "@/types";

type SessionContextProps = {
  sessionProfile: SessionProfile | null;
  isAuthenticated: boolean;
};

const SessionContext = createContext({} as SessionContextProps);

type SessionProviderProps = {
  children: React.ReactNode;
  sessionProfile: SessionProfile | null;
};

export const SessionProvider = ({
  sessionProfile,
  children,
}: SessionProviderProps) => {
  return (
    <SessionContext.Provider
      value={{ sessionProfile, isAuthenticated: !!sessionProfile }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
