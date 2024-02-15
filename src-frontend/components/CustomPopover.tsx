import { CSSProperties } from "@emotion/serialize";
import { COLOR_BG_TERTIARY } from "../styles/colors";
import { useEffect, useRef } from "react";

interface Props {
  width: number;
  height: number;
  bottom: number;
  left: number;
  children: React.ReactNode | React.ReactNode[];
  style?: CSSProperties;
  isOpen: boolean;
  onClose: any;
}

//DIY POPOVER for one use case
export const CustomPopover = (props: Props) => {
  const { width, height, bottom, left, children, isOpen, onClose } = props;
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      style={{
        position: "fixed",
        zIndex: 1000,
        left: left,
        bottom: bottom,
        height: height,
        width: width,
        background: COLOR_BG_TERTIARY,
        borderRadius: "30px",
        padding: "16px",
      }}
    >
      {children}
    </div>
  );
};
