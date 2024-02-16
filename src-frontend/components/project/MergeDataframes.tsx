import { Box, Checkbox, Heading } from "@chakra-ui/react";
import { useProjectContext } from "../../context/project";
import { FormSubmitBar } from "../SubmitBar";
import { useEffect, useRef } from "react";
import { isDictEmpty } from "../../utils";
import { mergeDataframes } from ".";

export type SelectedDataframe = { [key: string]: boolean };

export const MergeDataframes = () => {
  const { projectQuery, selectedFile, mergeDataframesModal } =
    useProjectContext();

  const selectedFiles = useRef<SelectedDataframe>({});

  useEffect(() => {
    if (!projectQuery.data || !projectQuery.data.datafiles) return;

    selectedFiles.current = {};

    const datafiles = projectQuery.data.datafiles;

    datafiles.forEach((item) => {
      selectedFiles.current[item.file_name] = false;
    });
  }, [projectQuery.data]);

  if (
    !projectQuery.data?.datafiles ||
    !selectedFile ||
    isDictEmpty(selectedFiles)
  )
    return null;

  const datafiles = projectQuery.data.datafiles.filter((item) => {
    if (!selectedFile.merged_dataframes) return true;
    return !selectedFile.merged_dataframes.includes(item.file_name);
  });

  const submit = () => {
    const dataframes: string[] = [];
    for (const [key, value] of Object.entries(selectedFiles.current)) {
      console.log(key, value);
      if (value) {
        dataframes.push(key);
      }
    }

    mergeDataframes(selectedFile.id, dataframes, () => {
      mergeDataframesModal.onClose();
    });
  };
  return (
    <Box>
      <Heading size={"s"}>Select dataframes for merge</Heading>
      {datafiles.map((item) => {
        if (item.id === selectedFile.id) return null;
        return (
          <Box
            key={item.id}
            display={"flex"}
            alignItems={"center"}
            gap={"6px"}
            marginTop={"8px"}
          >
            <Checkbox
              isChecked={selectedFiles.current[item.file_name]}
              onChange={() => {
                selectedFiles.current[item.file_name] =
                  !selectedFiles.current[item.file_name];
              }}
            />
            {item.file_name}
          </Box>
        );
      })}

      <FormSubmitBar style={{ marginTop: "16px" }} submitCallback={submit} />
    </Box>
  );
};
