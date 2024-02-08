import { Box, Input } from "@chakra-ui/react";
import { useState } from "react";
import { FormSubmitBar } from "./SubmitBar";
import { createProject } from "../client/requests";

interface Props {
  successCallback: (projectName: string) => void;
  onClose: () => void;
}

export const NameProjectModal = (props: Props) => {
  const [projectNameInput, setProjectNameInput] = useState("");

  const onSubmit = async () => {
    const res = await createProject({ name: projectNameInput });
    if (res.status === 200) {
      props.successCallback(projectNameInput);
    }
  };
  return (
    <Box>
      <Input
        value={projectNameInput}
        onChange={(e) => setProjectNameInput(e.target.value)}
      />
      <FormSubmitBar
        style={{ marginTop: "32px" }}
        submitCallback={onSubmit}
        submitDisabled={!projectNameInput}
        cancelCallback={props.onClose}
      />
    </Box>
  );
};
