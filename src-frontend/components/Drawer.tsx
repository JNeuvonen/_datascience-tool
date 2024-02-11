import React, { CSSProperties, ReactNode } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerProps,
} from "@chakra-ui/react";
import { COLOR_BG_PRIMARY } from "../styles/colors";
import { useLayoutContext } from "../context/layout";

interface CustomDrawerProps extends DrawerProps {
  title: string;
  children: ReactNode;
  footerContent?: ReactNode;
  drawerContentStyles?: CSSProperties;
}

export const ChakraDrawer: React.FC<CustomDrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footerContent,
  drawerContentStyles,
  ...props
}) => {
  const { titleBarHeight } = useLayoutContext();
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} {...props}>
      <DrawerOverlay />
      <DrawerContent
        background={COLOR_BG_PRIMARY}
        style={drawerContentStyles}
        marginTop={titleBarHeight}
      >
        <DrawerCloseButton />
        <DrawerHeader>{title}</DrawerHeader>
        <DrawerBody>{children}</DrawerBody>
        {footerContent && <DrawerFooter>{footerContent}</DrawerFooter>}
      </DrawerContent>
    </Drawer>
  );
};
