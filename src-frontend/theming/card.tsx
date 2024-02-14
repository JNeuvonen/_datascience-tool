import {
  COLOR_BG_PRIMARY_SHADE_ONE,
  COLOR_CONTENT_PRIMARY,
} from "../styles/colors";

export const cardTheme = {
  parts: ["container", "header", "body"],
  baseStyle: {
    container: {
      backgroundColor: COLOR_BG_PRIMARY_SHADE_ONE,
      color: COLOR_CONTENT_PRIMARY,
      borderRadius: "10px",
    },
    header: {},
    body: {
      backgroundColor: COLOR_BG_PRIMARY_SHADE_ONE,
      borderRadius: "10px",
    },
  },
};
