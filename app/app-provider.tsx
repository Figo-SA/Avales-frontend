"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";

interface ContextProps {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
}

// Better default values with proper types
const AppContext = createContext<ContextProps>({
  sidebarOpen: false,
  setSidebarOpen: () => {
    console.warn("AppProvider not initialized");
  },
  toggleSidebar: () => {
    console.warn("AppProvider not initialized");
  },
  openSidebar: () => {
    console.warn("AppProvider not initialized");
  },
  closeSidebar: () => {
    console.warn("AppProvider not initialized");
  },
});

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Memoized callbacks for better performance
  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const openSidebar = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      sidebarOpen,
      setSidebarOpen,
      toggleSidebar,
      openSidebar,
      closeSidebar,
    }),
    [sidebarOpen, toggleSidebar, openSidebar, closeSidebar]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

// Custom hook with optional error handling
export const useAppProvider = () => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useAppProvider must be used within an AppProvider");
  }

  return context;
};
