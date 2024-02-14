import { COLOR_BG_SECONDARY } from "../styles/colors";

export const BOX_VARIANTS = {
  hoverable: "hoverable",
};

const boxHoverable = () => ({
  _hover: {
    backgroundColor: COLOR_BG_SECONDARY,
  },
});

export const boxTheme = {
  Box: {
    variants: {
      hoverable: boxHoverable,
    },
  },
};
