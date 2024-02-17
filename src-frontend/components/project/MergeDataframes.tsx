import {
  Box,
  Button,
  Checkbox,
  Heading,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useProjectContext } from "../../context/project";
import { FormSubmitBar } from "../SubmitBar";
import { useEffect, useRef, useState } from "react";
import { isDictEmpty } from "../../utils";
import { mergeDataframes } from ".";
import { BasicTable } from "../UnstyledTable";
import { BUTTON_VARIANTS, TEXT_VARIANTS } from "../../theming";
import { ChakraModal } from "../Modal";
import { DataFile } from "../../client/requests";

export type SelectedDataframe = { [key: string]: boolean };

const TABLE_COLS = ["File name", "Join column"];

export const MergeDataframes = () => {
  const { projectQuery, selectedFile, mergeDataframesModal } =
    useProjectContext();
  const setJoinColModal = useDisclosure();
  const [joinColModalFile, setJoinColModalFile] = useState<DataFile | null>(
    null
  );

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
    if (!projectQuery.data?.datafiles.length) return;

    const dataframes: string[] = [];
    for (const [key, value] of Object.entries(selectedFiles.current)) {
      if (value) {
        for (let i = 0; i < projectQuery.data?.datafiles.length; ++i) {
          const item = projectQuery.data.datafiles[i];
          if (item.file_name === key) {
            dataframes.push(item.df_table_name);
          }
        }
      }
    }

    mergeDataframes(selectedFile.id, dataframes, () => {
      mergeDataframesModal.onClose();
    });
  };

  return (
    <Box>
      <Heading size={"s"}>Select dataframes for merge</Heading>
      <BasicTable
        columns={TABLE_COLS}
        containerStyles={{ marginTop: "16px" }}
        rows={datafiles
          .filter((item) => item.id !== selectedFile.id)
          .map((item) => {
            return [
              <Box display={"flex"} alignItems={"center"} gap={"6px"}>
                <Checkbox
                  isChecked={selectedFiles.current[item.file_name]}
                  isDisabled={!item.join_column}
                  onChange={() => {
                    selectedFiles.current[item.file_name] =
                      !selectedFiles.current[item.file_name];
                  }}
                />
                <span>{item.file_name}</span>
              </Box>,
              item.join_column ? (
                item.join_column
              ) : (
                <Tooltip
                  label="Dataframe has less than one column"
                  isDisabled={item.columns !== null && item.columns.length > 1}
                >
                  <Button
                    height={"20px"}
                    variant={BUTTON_VARIANTS.nofill}
                    fontSize={"14px"}
                    isDisabled={!item.columns}
                    onClick={() => {
                      setJoinColModalFile(item);
                      setJoinColModal.onOpen();
                    }}
                  >
                    Set join column
                  </Button>
                </Tooltip>
              ),
            ];
          })}
      />
      <FormSubmitBar style={{ marginTop: "16px" }} submitCallback={submit} />

      <ChakraModal
        {...setJoinColModal}
        title={"Set join column"}
        modalContentStyle={{
          marginTop: "25%",
        }}
      >
        {joinColModalFile && joinColModalFile.columns ? (
          <Box marginTop={"16px"}>
            {joinColModalFile.columns.map((item, idx) => {
              return (
                <Text key={idx} variant={TEXT_VARIANTS.clickable}>
                  {item}
                </Text>
              );
            })}
          </Box>
        ) : null}
      </ChakraModal>
    </Box>
  );
};
