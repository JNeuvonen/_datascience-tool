import { Box, Input } from "@chakra-ui/react";
import { useState } from "react";
import { FormSubmitBar } from "./SubmitBar";

interface Props {
  successCallback: (input: string) => void;
  onClose: () => void;
}

export const TextInputModal = (props: Props) => {
  const { successCallback } = props;
  const [input, setInput] = useState("");

  const onSubmit = () => {
    successCallback(input);
  };
  return (
    <Box>
      <Input value={input} onChange={(e) => setInput(e.target.value)} />
      <FormSubmitBar
        style={{ marginTop: "32px" }}
        submitCallback={onSubmit}
        submitDisabled={!input}
        cancelCallback={props.onClose}
      />
    </Box>
  );
};
