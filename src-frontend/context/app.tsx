import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";

import { invoke } from "@tauri-apps/api/tauri";
import { TAURI_COMMANDS } from "../utils/constants";
import { BASE_URL } from "../utils/endpoints";

export type Platform = "" | "macos" | "windows" | "linux";
export type ToolbarMode = "TRAINING" | "";

interface AppContextType {
  platform: Platform;
  serverLaunched: boolean;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [platform, setPlatform] = useState<Platform>("");
  const [serverLaunched, setServerLaunched] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(BASE_URL + "/")
        .then((response) => {
          if (response.status === 200) {
            setServerLaunched(true);
            clearInterval(interval);
          }
          return response.json();
        })
        .catch();
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchAppData = async () => {
      try {
        const platform: Platform = await invoke(TAURI_COMMANDS.fetch_platform);
        setPlatform(platform);
      } catch (error) {
        console.error("Error fetching app data:", error);
      }
    };

    fetchAppData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        platform,
        serverLaunched,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
