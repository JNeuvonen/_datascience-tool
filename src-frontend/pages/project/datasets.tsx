import {
  Box,
  Button,
  useDisclosure,
  useTimeout,
  useToast,
} from "@chakra-ui/react";
import { open } from "@tauri-apps/api/dialog";
import { ApiResponse } from "../../utils/request";
import { uploadDataset, uploadDatasets } from "../../client/requests";
import { usePathParams } from "../../hooks/usePathParams";
import { ChakraModal } from "../../components/Modal";
import { NameProjectModal } from "../../components/NameProjectModal";
import { useNavigate } from "react-router-dom";
import { DOM_EVENT_CHANNELS, ROUTES, ROUTE_KEYS } from "../../utils/constants";
import { useEffect, useRef, useState } from "react";
import useQueryParams from "../../hooks/useQueryParams";
import { removeQueryParam } from "../../utils/location";
import { UploadScreen } from "../../components/UploadFilesScreen";
import { useMessageListener } from "../../hooks/useMessageListener";

interface PageQueryParams {
  openFileSelection: string | undefined;
}

export const ProjectDatasetsPage = () => {
  const { project } = usePathParams<{ project: string }>();
  const navigate = useNavigate();
  const { openFileSelection } = useQueryParams<PageQueryParams>();
  const renameProjectModal = useDisclosure();
  const toast = useToast();
  const fileSelectorOpenedLock = useRef(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [loadingScreenText, setLoadingScreenText] = useState(
    `Loading... 0 out of 7 files have been uploaded.`
  );
  const [loadingScreenProgress, setLoadingScreenProgress] = useState(0);

  useMessageListener({
    messageName: DOM_EVENT_CHANNELS.upload_file,
    messageCallback: (e) => {
      const data: { filesUploaded: number; filesMax: number } = JSON.parse(
        e.detail
      );
      setLoadingScreenText(
        `Loading... ${data.filesUploaded} out of ${data.filesMax} files have been uploaded.`
      );
      setLoadingScreenProgress(
        Math.round((data.filesUploaded / data.filesMax) * 100)
      );
    },
  });

  useEffect(() => {
    if (openFileSelection && Number(openFileSelection) === 1) {
      setTimeout(() => {
        if (fileSelectorOpenedLock.current == false) {
          handleFileSelection();
          removeQueryParam("openFileSelection");
          fileSelectorOpenedLock.current = true;
        }
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
      setLoadingScreenText(
        `Loading... 0 out of ${files.length} files have been uploaded.`
      );
      setUploadingFiles(true);
      const res = await uploadDatasets(project, files);
      if (res.status === 200) {
        setUploadingFiles(false);
        setLoadingScreenText("");
      } else {
        setUploadingFiles(false);
      }
    } else {
    }
  };

  return (
    <Box>
      <UploadScreen
        shouldBeVisible={uploadingFiles}
        text={loadingScreenText}
        loadingScreenProgress={loadingScreenProgress}
      />
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
