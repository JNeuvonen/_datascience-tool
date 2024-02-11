import { CSSProperties, useEffect } from "react";
import { useLayoutContext } from "../context/layout";
import { Box } from "@chakra-ui/react";
import { COLOR_BG_PRIMARY } from "../styles/colors";

interface Props {
  width: number;
  children: React.ReactNode;
  style?: CSSProperties;
}

export const Sidebar = (props: Props) => {
  const { width, children, style } = props;
  const { setSideBarWidth, titleBarHeight, updateSideBarContent } =
    useLayoutContext();

  useEffect(() => {
    setSideBarWidth(width);
    return () => {
      setSideBarWidth(0);
      updateSideBarContent(null);
    };
  }, []);
  return (
    <Box
      width={width}
      height="100vh"
      bg={COLOR_BG_PRIMARY}
      position="fixed"
      left="0"
      top={titleBarHeight}
      paddingLeft={"8px"}
      paddingRight={"8px"}
      paddingTop={"16px"}
      style={style}
    >
      {children}
    </Box>
  );
};
