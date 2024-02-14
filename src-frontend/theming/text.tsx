import {
  COLOR_BRAND_SECONDARY_HIGHLIGHT,
  COLOR_BRAND_SECONDARY_SHADE_ONE,
  COLOR_CONTENT_PRIMARY,
} from "../styles/colors";

export const TEXT_VARIANTS = {
  clickable: "clickable",
  plain: "plain",
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

export const textTheme = {
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
