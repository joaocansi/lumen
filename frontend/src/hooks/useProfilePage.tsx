"use client";

import { createContext, useContext } from "react";

import { ProfileWithMetadataAndSessionInfo } from "@/types";

export interface ProfilePageProps {
  profile: ProfileWithMetadataAndSessionInfo;
}

export const ProfilePageContext = createContext({} as ProfilePageProps);

interface ProfilePageProviderProps {
  children: React.ReactNode;
  profile: ProfileWithMetadataAndSessionInfo;
}

export function ProfilePageProvider({
  children,
  profile,
}: ProfilePageProviderProps) {
  return (
    <ProfilePageContext.Provider value={{ profile }}>
      {children}
    </ProfilePageContext.Provider>
  );
}

export const useProfilePage = () => useContext(ProfilePageContext);
