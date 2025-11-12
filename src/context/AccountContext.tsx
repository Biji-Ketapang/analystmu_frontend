"use client";
import React, { createContext, useContext, useState } from "react";

export type AccountType = "PENS" | "ITS" | "PPNS";

interface AccountContextProps {
  account: AccountType;
  setAccount: (account: AccountType) => void;
}

const AccountContext = createContext<AccountContextProps | undefined>(undefined);

export const AccountProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<AccountType>("PENS");
  return (
    <AccountContext.Provider value={{ account, setAccount }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) throw new Error("useAccount must be used within AccountProvider");
  return context;
}
