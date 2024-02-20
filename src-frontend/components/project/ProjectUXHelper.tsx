import { useEffect } from "react";
import { useProjectContext } from "../../context/project";
import { Box, useToast } from "@chakra-ui/react";
import { ChakraModal } from "../Modal";
import { SetJoinColModal } from "./SetJoinColModal";
import { MergeDataframes, NameProjectModal } from ".";
import { useNavigate } from "react-router-dom";
import { ROUTES, ROUTE_KEYS } from "../../utils/constants";
import { TextInputModal } from "../PromptTextInputModal";
import cloneDeep from "lodash/cloneDeep";
import { updateDatafile } from ".";
import { ConfirmModal } from "../ConfirmModal";
import { deleteDatafile } from "./useProjectSubmits";
import { ExportDataModal } from "./ExportDataModal";

export const ProjectUXHelper = () => {
  const {
    projectQuery,
    setJoinColModal,
    renameDatafileModal,
    renameProjectModal,
    selectedFileContext,
    deleteFileModal,
    mergeDataframesModal,
    exportDataModal,
  } = useProjectContext();

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!projectQuery.data?.project.join_column) {
      const joinColOptions =
        projectQuery.data?.metadata.join_col.common_columns;

      if (joinColOptions && joinColOptions?.length > 0) {
        setJoinColModal.onOpen();
      }
    }
  }, [projectQuery.data]);

  return (
    <div>
      <ChakraModal
        {...renameProjectModal}
        title={"Let's name your project first"}
        modalContentStyle={{
          marginTop: "25%",
        }}
      >
        <NameProjectModal
          onClose={renameProjectModal.onClose}
          successCallback={(projectName) => {
            toast({
              title: "Created project",
              position: "bottom-left",
              status: "info",
              duration: 5000,
              isClosable: true,
            });
            navigate(
              ROUTES.project.replace(ROUTE_KEYS.project, projectName) +
                `?defaultTab=1&openFileSelection=1`
            );
            renameProjectModal.onClose();
          }}
        />
      </ChakraModal>
      <ChakraModal
        {...setJoinColModal}
        title={"Set a join column for the project files"}
        modalContentStyle={{
          marginTop: "25%",
        }}
      >
        <SetJoinColModal
          successCallback={setJoinColModal.onClose}
          onClose={setJoinColModal.onClose}
          commonColumns={
            projectQuery.data?.metadata.join_col.common_columns || []
          }
        />
      </ChakraModal>
      <ChakraModal
        {...renameDatafileModal}
        title={"Set a new name for the file"}
        modalContentStyle={{
          marginTop: "25%",
        }}
      >
        <TextInputModal
          {...renameDatafileModal}
          successCallback={(newName: string) => {
            const clonedDatafile = cloneDeep(selectedFileContext);
            if (!clonedDatafile) return;
            clonedDatafile.file_name = newName;
            updateDatafile(clonedDatafile, () => {
              projectQuery.refetch();
              renameDatafileModal.onClose();
            });
          }}
        />
      </ChakraModal>
      <ChakraModal
        {...mergeDataframesModal}
        title={"Merge dataframes"}
        modalContentStyle={{
          marginTop: "15%",
          maxWidth: "1200px",
        }}
      >
        <MergeDataframes />
      </ChakraModal>

      <ChakraModal
        {...exportDataModal}
        title={"Export data"}
        modalContentStyle={{
          marginTop: "15%",
        }}
      >
        <ExportDataModal />
      </ChakraModal>
      <ConfirmModal
        {...deleteFileModal}
        onConfirm={() => {
          if (!selectedFileContext) return;
          deleteDatafile(selectedFileContext.id, () => {
            projectQuery.refetch();
            deleteFileModal.onClose();
          });
        }}
        cancelCallback={deleteFileModal.onClose}
        message={
          <>
            Are you sure you want to delete file{" "}
            <strong>{selectedFileContext?.file_name}</strong>?
          </>
        }
      />
    </div>
  );
};
