import { extendTheme } from "@chakra-ui/react";
import { COLOR_BG_PRIMARY, COLOR_CONTENT_PRIMARY } from "../styles/colors";
import {
  buttonTheme,
  textTheme,
  headingTheme,
  boxTheme,
  cardTheme,
  menuItemTheme,
  dividerTheme,
} from ".";

export const customChakraTheme = extendTheme({
  styles: {
    global: {
      body: {
        backgroundColor: COLOR_BG_PRIMARY,
        color: COLOR_CONTENT_PRIMARY,
      },
    },
  },
  components: {
    ...buttonTheme,
    ...textTheme,
    ...headingTheme,
    ...cardTheme,
    ...dividerTheme,
    ...boxTheme,
    Card: cardTheme,
    Menu: menuItemTheme,
  },
});
