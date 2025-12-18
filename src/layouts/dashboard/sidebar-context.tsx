import type { ReactNode } from 'react';

import { useState, useContext, createContext } from 'react';

type SidebarContextType = {
  isCollapsed: boolean;
  toggleCollapse: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleCollapse }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarCollapse() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebarCollapse must be used within SidebarProvider');
  }
  return context;
}
