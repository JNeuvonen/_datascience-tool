import { Box } from "@chakra-ui/react";
import React from "react";
import { TauriTitleBar } from "../components/TitleBar";
import { useLayoutContext } from "../context/layout";
import { COLOR_BG_PRIMARY_SHADE_TWO } from "../styles/colors";

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  const { titleBarHeight, sideBarWidth, pageTabsheight, menuBarHeight } =
    useLayoutContext();
  return (
    <Box paddingTop={titleBarHeight}>
      <TauriTitleBar />
      <Box
        marginLeft={sideBarWidth}
        bg={COLOR_BG_PRIMARY_SHADE_TWO}
        padding={"16px"}
        paddingBottom={"10px"}
        minHeight={`calc(100vh - ${titleBarHeight}px)`}
        marginTop={pageTabsheight}
        paddingTop={menuBarHeight + 16}
      >
        {children}
      </Box>
    </Box>
  );
};
