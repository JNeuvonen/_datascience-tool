import { Box } from "@chakra-ui/react";
import { useEffect } from "react";
import { useLayoutContext } from "../context/layout";
import { COLOR_BG_PRIMARY } from "../styles/colors";

const WIDTH = 250;

export const SideBarProject = () => {
  const { setSideBarWidth, titleBarHeight, updateSideBarContent } =
    useLayoutContext();

  useEffect(() => {
    setSideBarWidth(WIDTH);
    return () => {
      setSideBarWidth(0);
      updateSideBarContent(null);
    };
  }, []);
  return (
    <Box
      width={WIDTH}
      height="100vh"
      bg={COLOR_BG_PRIMARY}
      position="fixed"
      left="0"
      top={titleBarHeight}
      paddingLeft={"8px"}
      paddingRight={"8px"}
    ></Box>
  );
};
