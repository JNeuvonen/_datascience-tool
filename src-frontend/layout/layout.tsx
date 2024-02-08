import { Box } from "@chakra-ui/react";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  return <Box padding={"16px"}>{children}</Box>;
};
