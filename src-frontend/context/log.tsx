import { Spinner, useToast } from "@chakra-ui/react";
import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { REST_API_URL } from "../utils/endpoints";
import {
  BACKEND_STREAM_MESSAGES,
  DOM_EVENT_CHANNELS,
} from "../utils/constants";
import { useLayoutContext } from "./layout";

interface LogContextType {
  logs: LogMessage[];
}

export const LogContext = createContext<LogContextType>({
  logs: [],
});

interface LogProviderProps {
  children: ReactNode;
}

interface LogMessage {
  msg: string;
  log_level: number;
  display: boolean;
  refetch: boolean;
  dom_event: string;
  notification_duration?: number;
}

interface DispatchDomEventProps {
  channel: string;
  data?: string;
}

let socket: WebSocket | null;

export const dispatchDomEvent = ({
  channel,
  data = "",
}: DispatchDomEventProps) => {
  const message = new CustomEvent(channel, { detail: data });
  window.dispatchEvent(message);
};

export const LogProvider: React.FC<LogProviderProps> = ({ children }) => {
  const { updateTitleBarContent } = useLayoutContext();
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const toast = useToast();

  const getToastStatus = (
    logLevel: number
  ): "info" | "warning" | "error" | "success" => {
    if (logLevel === 20) {
      return "info";
    }
    if (logLevel === 30) {
      return "warning";
    }

    if (logLevel === 40) {
      return "error";
    }
    return "success";
  };

  const checkForBackendSignals = (msg: string) => {
    if (msg.includes(BACKEND_STREAM_MESSAGES.upload_file)) {
      const parts = msg.split(":")[1].split("/");
      const filesDone = Number(parts[0]);
      const filesMax = Number(parts[1]);

      if (filesDone == filesMax) {
        updateTitleBarContent(null);
        return;
      }

      const domMessage = JSON.stringify({
        filesUploaded: filesDone,
        filesMax: filesMax,
      });
      dispatchDomEvent({
        channel: DOM_EVENT_CHANNELS.upload_file,
        data: domMessage,
      });
      updateTitleBarContent(
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Spinner size={"xs"} /> Added {filesDone}/{filesMax} files
        </div>
      );
    } else if (msg.includes(BACKEND_STREAM_MESSAGES.file_upload_finish)) {
      updateTitleBarContent(null);
      toast({
        title: "Added files to the project",
        position: "bottom-left",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      socket = new WebSocket(REST_API_URL.log_stream);
      socket.onmessage = (event) => {
        if (event.data === "health") return;
        const data: LogMessage = JSON.parse(event.data);

        checkForBackendSignals(data.msg);

        if (data.dom_event) {
          dispatchDomEvent({ channel: data.dom_event, data: data.msg });
        }
        if (data.display) {
          toast({
            title: data.msg,
            status: getToastStatus(data.log_level),
            duration: data.notification_duration ?? 5000,
            isClosable: true,
          });
        }
        addLog(data);
      };

      socket.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };
    }, 1000);
    return () => clearTimeout(timerId);
  }, [toast]);

  const addLog = (newLog: LogMessage) => {
    setLogs((prevLogs) => {
      const updatedLogs = [newLog, ...prevLogs];
      if (updatedLogs.length > 1000) {
        return updatedLogs.slice(0, 1000);
      }
      return updatedLogs;
    });
  };

  return <LogContext.Provider value={{ logs }}>{children}</LogContext.Provider>;
};

export const useLogs = () => useContext(LogContext);
