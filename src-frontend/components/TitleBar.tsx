import { FaGear } from "react-icons/fa6";
import { WindowTitlebar } from "../thirdparty/tauri-controls";
import { Box, IconButton, Spinner } from "@chakra-ui/react";
import { useAppContext } from "../context/app";
import { COLOR_DARK_BG_PRIMARY } from "../styles/colors";
import { TooltipIcon } from "./TooltipIcon";
import { ROUTES } from "../utils/constants";
import { useLayoutContext } from "../context/layout";
import { MdArrowForward } from "react-icons/md";
import { BUTTON_VARIANTS } from "../theming";

export const TauriTitleBar = () => {
  const { titleBarHeight, titleBarContent, breadCrumbsContent } =
    useLayoutContext();
  const { platform, serverLaunched } = useAppContext();

  const getPlatform = () => {
    switch (platform) {
      case "macos":
        return "macos";
      case "windows":
        return "windows";

      case "linux":
        return "gnome";
    }
    return "macos";
  };

  const renderTitleBarContent = () => {
    if (!serverLaunched) {
      return (
        <div>
          <Spinner size={"xs"} />
        </div>
      );
    }

    return titleBarContent;
  };

  return (
    <WindowTitlebar
      windowControlsProps={{
        platform: getPlatform(),
      }}
      controlsOrder={platform === "macos" ? "left" : "right"}
      style={{
        height: titleBarHeight,
        background: COLOR_DARK_BG_PRIMARY,
        borderTopRightRadius: "13px",
        borderTopLeftRadius: "13px",
        position: "fixed",
        width: "100%",
        zIndex: "1000000 !important",
        top: 0,
        left: 0,
      }}
    >
      <div
        style={{
          height: titleBarHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          paddingRight: "16px",
          gap: "16px",
          zIndex: "1000000 !important",
        }}
        data-tauri-drag-region
      >
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <IconButton
            aria-label="Icon button"
            icon={<MdArrowForward style={{ transform: "rotate(180deg)" }} />}
            variant={BUTTON_VARIANTS.grey}
            onClick={() => window.history.back()}
          />
          <IconButton
            aria-label="Icon button"
            icon={<MdArrowForward />}
            variant={BUTTON_VARIANTS.grey}
            onClick={() => window.history.forward()}
          />
          <Box>{breadCrumbsContent}</Box>
        </div>

        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {renderTitleBarContent()}
          <TooltipIcon
            icon={(props) => <FaGear {...props} />}
            to={ROUTES.settings}
          />
        </div>
      </div>
    </WindowTitlebar>
  );
};
