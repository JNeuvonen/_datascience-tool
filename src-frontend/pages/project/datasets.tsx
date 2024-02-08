import {
  Box,
  Button,
  useDisclosure,
  useTimeout,
  useToast,
} from "@chakra-ui/react";
import { open } from "@tauri-apps/api/dialog";
import { ApiResponse } from "../../utils/request";
import { uploadDataset } from "../../client/requests";
import { usePathParams } from "../../hooks/usePathParams";
import { ChakraModal } from "../../components/Modal";
import { NameProjectModal } from "../../components/NameProjectModal";
import { useNavigate } from "react-router-dom";
import { ROUTES, ROUTE_KEYS } from "../../utils/constants";
import { useEffect } from "react";
import useQueryParams from "../../hooks/useQueryParams";
import { removeQueryParam } from "../../utils/location";

interface PageQueryParams {
  openFileSelection: string | undefined;
}

export const ProjectDatasetsPage = () => {
  const { project } = usePathParams<{ project: string }>();
  const navigate = useNavigate();
  const { openFileSelection } = useQueryParams<PageQueryParams>();
  const renameProjectModal = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    if (openFileSelection && Number(openFileSelection) === 1) {
      setTimeout(() => {
        handleFileSelection();
        removeQueryParam("openFileSelection");
      }, 250);
    }
  }, [openFileSelection]);

  const handleFileSelection = async () => {
    if (project === "unnamed") {
      renameProjectModal.onOpen();
      return;
    }

    const files = await open({ multiple: true });

    if (Array.isArray(files)) {
      const promises: Promise<ApiResponse>[] = [];
      files.forEach((item) => {
        promises.push(uploadDataset({ datasetPath: item }));
      });
    } else {
    }
  };

  return (
    <Box>
      <Button onClick={handleFileSelection}>+ Add</Button>
      <ChakraModal
        {...renameProjectModal}
        title={"Let's name your project first"}
      >
        <NameProjectModal
          onClose={renameProjectModal.onClose}
          successCallback={(projectName) => {
            toast({
              title: "Created project",
              position: "top-right",
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
    </Box>
  );
};
