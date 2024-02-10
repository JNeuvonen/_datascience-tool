import { FaGear } from "react-icons/fa6";
import { WindowTitlebar } from "../thirdparty/tauri-controls";
import { Spinner } from "@chakra-ui/react";
import { useAppContext } from "../context/app";
import { COLOR_DARK_BG_PRIMARY } from "../styles/colors";
import { TooltipIcon } from "./TooltipIcon";
import { ROUTES } from "../utils/constants";

export const TauriTitleBar = () => {
  const { titleBarHeight, titleBarContent } = useAppContext();
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
          justifyContent: "flex-end",
          width: "100%",
          paddingRight: "16px",
          gap: "16px",
          zIndex: "1000000 !important",
        }}
        data-tauri-drag-region
      >
        {renderTitleBarContent()}
        <TooltipIcon
          icon={(props) => <FaGear {...props} />}
          to={ROUTES.settings}
        />
      </div>
    </WindowTitlebar>
  );
};
