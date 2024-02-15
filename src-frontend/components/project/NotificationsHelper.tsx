import { useEffect } from "react";
import { useProjectContext } from "../../context/project";
import { useDisclosure } from "@chakra-ui/react";
import { ChakraModal } from "../Modal";
import { SetJoinColModal } from "./SetJoinColModal";

export const ProjectUXHelper = () => {
  const { projectQuery } = useProjectContext();
  const setJoinColModal = useDisclosure();

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
        {...setJoinColModal}
        title={"Set a join column for the project files"}
      >
        <SetJoinColModal
          successCallback={setJoinColModal.onClose}
          onClose={setJoinColModal.onClose}
          commonColumns={
            projectQuery.data?.metadata.join_col.common_columns || []
          }
        />
      </ChakraModal>
    </div>
  );
};
