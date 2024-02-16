import { Box, Checkbox, Heading } from "@chakra-ui/react";
import { useProjectContext } from "../../context/project";
import { FormSubmitBar } from "../SubmitBar";

export const MergeDataframes = () => {
  const { projectQuery, selectedFile } = useProjectContext();

  if (!projectQuery.data?.datafiles || !selectedFile) return null;

  const datafiles = projectQuery.data.datafiles;
  return (
    <Box>
      <Heading size={"s"}>Select dataframes for merge</Heading>
      {datafiles.map((item) => {
        if (item.id === selectedFile.id) return null;
        return (
          <Box
            display={"flex"}
            alignItems={"center"}
            gap={"6px"}
            marginTop={"8px"}
          >
            <Checkbox />
            {item.file_name}
          </Box>
        );
      })}

      <FormSubmitBar style={{ marginTop: "16px" }} />
    </Box>
  );
};
