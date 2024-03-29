import { useState, ReactElement } from "react";
import { Box, Tooltip } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  COLOR_BG_SECONDARY_SHADE_ONE,
  COLOR_CONTENT_PRIMARY,
  COLOR_CONTENT_SECONDARY,
} from "../styles/colors";

interface Props {
  icon: (props: { fill: string }) => ReactElement;
  defaultFill?: string;
  hoverFill?: string;
  containerHoverBg?: string;
  tooltipLabel?: string;
  to?: string;
}

export const TooltipIcon = ({
  icon: Icon,
  defaultFill = COLOR_CONTENT_PRIMARY,
  hoverFill = COLOR_CONTENT_SECONDARY,
  containerHoverBg = COLOR_BG_SECONDARY_SHADE_ONE,
  tooltipLabel,
  to,
}: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    }
  };

  const iconElement = <Icon fill={isHovered ? hoverFill : defaultFill} />;

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{ padding: "10px", borderRadius: "10px", cursor: "pointer" }}
      _hover={{ backgroundColor: containerHoverBg }}
    >
      {tooltipLabel ? (
        <Tooltip label={tooltipLabel}>{iconElement}</Tooltip>
      ) : (
        iconElement
      )}
    </Box>
  );
};
