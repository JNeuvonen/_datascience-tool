import { extendTheme } from "@chakra-ui/react";
import { menuAnatomy } from "@chakra-ui/anatomy";
import {
  COLOR_BG_PRIMARY,
  COLOR_BG_PRIMARY_SHADE_ONE,
  COLOR_BG_PRIMARY_SHADE_THREE,
  COLOR_BG_SECONDARY,
  COLOR_BG_TERTIARY,
  COLOR_BRAND_SECONDARY_HIGHLIGHT,
  COLOR_BRAND_SECONDARY_SHADE_ONE,
  COLOR_CONTENT_PRIMARY,
  COLOR_CONTENT_PRIMARY_SHADE_TWO,
  COLOR_CONTENT_SECONDARY_SHADE_THREE,
} from "./styles/colors";

export const BUTTON_VARIANTS = {
  cta: "cta",
  grey: "grey",
  nofill: "noFill",
  noFillDefaultColor: "noFillDefaultColor",
  grey2: "grey2",
};

export const TEXT_VARIANTS = {
  clickable: "clickable",
  plain: "plain",
};

const buttonDefaultProps = {
  height: "30px",
};

const buttonCtaVariant = () => ({
  bg: COLOR_BRAND_SECONDARY_SHADE_ONE,
  color: COLOR_CONTENT_PRIMARY,
  _hover: {
    bg: COLOR_BRAND_SECONDARY_HIGHLIGHT,
  },
  ...buttonDefaultProps,
});

const buttonGreyVariant = () => ({
  bg: COLOR_BG_PRIMARY,
  color: COLOR_CONTENT_PRIMARY,
  _hover: {
    bg: COLOR_BG_PRIMARY_SHADE_THREE,
  },
  ...buttonDefaultProps,
});

const buttonGrey2Variant = () => ({
  bg: COLOR_BG_TERTIARY,
  color: COLOR_CONTENT_PRIMARY,
  _hover: {
    bg: COLOR_BG_PRIMARY_SHADE_THREE,
  },
  ...buttonDefaultProps,
});

const buttonNoFillVariant = () => ({
  color: COLOR_BRAND_SECONDARY_SHADE_ONE,
  bg: "transparent",
  padding: "0px !important",
  _hover: {
    bg: "transparent",
    color: COLOR_BRAND_SECONDARY_HIGHLIGHT,
  },

  ...buttonDefaultProps,
});

const buttonNoFillDefaultColor = () => ({
  color: COLOR_CONTENT_PRIMARY,
  bg: "transparent",
  padding: "0px !important",
  _hover: {
    bg: "transparent",
    color: COLOR_CONTENT_PRIMARY_SHADE_TWO,
  },

  ...buttonDefaultProps,
});

const buttonTheme = {
  Button: {
    baseStyle: {
      padding: "4px 20px",
    },
    variants: {
      cta: () => buttonCtaVariant(),
      grey: () => buttonGreyVariant(),
      noFill: () => buttonNoFillVariant(),
      noFillDefaultColor: () => buttonNoFillDefaultColor(),
      grey2: () => buttonGrey2Variant(),
    },
    defaultProps: {
      variant: "cta",
    },
  },
};

const textClickableVariant = () => ({
  cursor: "pointer",
  color: COLOR_BRAND_SECONDARY_SHADE_ONE,
  _hover: {
    color: COLOR_BRAND_SECONDARY_HIGHLIGHT,
    textDecoration: "underline",
  },
});

const textPlain = () => {
  return {
    color: COLOR_CONTENT_PRIMARY,
    fontWeight: 200,
  };
};

const textTheme = {
  Text: {
    baseStyle: {
      color: COLOR_CONTENT_PRIMARY,
    },
    variants: {
      clickable: () => textClickableVariant(),
      plain: () => textPlain(),
    },
    defaultProps: {
      variant: "",
    },
  },
};

const headingTheme = {
  Heading: {
    baseStyle: {
      color: COLOR_CONTENT_PRIMARY,
    },
    sizes: {},
    variants: {},
    defaultProps: {},
  },
};

const cardTheme = {
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
const menuItemTheme = {
  parts: menuAnatomy.keys,
  baseStyle: {
    item: {
      backgroundColor: COLOR_BG_PRIMARY_SHADE_ONE,
      color: COLOR_CONTENT_PRIMARY,
      _hover: {
        bg: COLOR_BG_SECONDARY,
      },
      _focus: {
        bg: COLOR_BG_SECONDARY,
      },
    },
    list: {
      border: "none",
      backgroundColor: COLOR_BG_PRIMARY_SHADE_ONE,
      borderRadius: "8px",
    },
    button: {
      fontWeight: "300",
      color: COLOR_CONTENT_PRIMARY,
      fontSize: 16,
      cursor: "pointer",
      padding: "6px",
      borderRadius: "3px",
      _hover: {
        color: "white",
        backgroundColor: COLOR_BG_PRIMARY_SHADE_ONE,
      },
    },
    command: {},
    divider: {
      my: "4",
      borderColor: "white",
      borderBottom: "2px dotted",
    },
  },
};

const dividerTheme = {
  Divider: {
    baseStyle: {
      borderColor: COLOR_CONTENT_SECONDARY_SHADE_THREE,
      borderWidth: "1px",
    },
  },
};

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
    Card: cardTheme,
    Menu: menuItemTheme,
  },
});
