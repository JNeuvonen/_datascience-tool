import {
  COLOR_BG_PRIMARY,
  COLOR_BG_PRIMARY_SHADE_THREE,
  COLOR_BG_TERTIARY,
  COLOR_BRAND_SECONDARY_HIGHLIGHT,
  COLOR_BRAND_SECONDARY_SHADE_ONE,
  COLOR_CONTENT_PRIMARY,
  COLOR_CONTENT_PRIMARY_SHADE_TWO,
} from "../styles/colors";

export const BUTTON_VARIANTS = {
  cta: "cta",
  grey: "grey",
  nofill: "noFill",
  noFillDefaultColor: "noFillDefaultColor",
  grey2: "grey2",
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

export const buttonTheme = {
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
