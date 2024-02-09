import { useEffect } from "react";

interface Props {
  messageName: string;
  messageCallback: (e: CustomEvent) => void;
}

export const useMessageListener = ({ messageName, messageCallback }: Props) => {
  useEffect(() => {
    const handler = (e: Event) => messageCallback(e as CustomEvent);
    window.addEventListener(messageName, handler);
    return () => window.removeEventListener(messageName, handler);
  }, [messageCallback, messageName]);
};
