import { Box } from "@chakra-ui/react";
import React from "react";
import { TauriTitleBar } from "../components/TitleBar";
import { useAppContext } from "../context/app";

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  const { titleBarHeight } = useAppContext();
  return (
    <Box padding={"16px"} paddingTop={titleBarHeight + 16}>
      <TauriTitleBar />
      {children}
    </Box>
  );
};
