import { Button } from "@chakra-ui/react";
import { CSSProperties } from "react";
import { BUTTON_VARIANTS } from "../theme";
import { useKeyListener } from "../hooks/useKeyListener";

interface Props {
  cancelText?: string;
  submitText?: string;
  submitDisabled?: boolean;
  hideCancel?: boolean;
  cancelCallback?: () => void;
  submitCallback?: () => void;
  style?: CSSProperties;
  mode?: "STICKY-BOTTOM" | "";
}

export const FormSubmitBar = ({
  cancelText = "Cancel",
  submitDisabled = false,
  cancelCallback,
  submitText = "Submit",
  submitCallback,
  style = {},
  mode = "",
}: Props) => {
  const stickyBottomStyle: CSSProperties = {
    position: "fixed",
    bottom: 20,
    width: `calc(100% - 46px)`,
  };

  useKeyListener({
    eventAction: (e) => {
      if (e.key === "Enter" && !submitDisabled && submitCallback) {
        submitCallback();
      }
    },
  });

  // Combine the styles based on the mode
  const combinedStyle =
    mode === "STICKY-BOTTOM" ? { ...style, ...stickyBottomStyle } : style;

  return (
    <div className="form-submit-bar" style={combinedStyle}>
      <Button variant={BUTTON_VARIANTS.nofill} onClick={cancelCallback}>
        {cancelText}
      </Button>
      <Button
        type="submit"
        onClick={submitCallback}
        isDisabled={submitDisabled}
      >
        {submitText}
      </Button>
    </div>
  );
};
