"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type BootState = {
  booted: boolean;
  setBooted: (v: boolean) => void;
};

const BootContext = createContext<BootState>({ booted: false, setBooted: () => {} });

export const useBoot = () => useContext(BootContext);

export function BootProvider({ children }: { children: ReactNode }) {
  const [booted, setBooted] = useState(false);
  const value = useMemo(() => ({ booted, setBooted }), [booted]);

  return <BootContext.Provider value={value}>{children}</BootContext.Provider>;
}
