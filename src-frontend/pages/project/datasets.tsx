import {
  Box,
  Button,
  Divider,
  Heading,
  Switch,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { open } from "@tauri-apps/api/dialog";
import { uploadDatasets } from "../../client/requests";
import { usePathParams } from "../../hooks/usePathParams";
import { ChakraModal } from "../../components/Modal";
import { NameProjectModal } from "../../components/NameProjectModal";
import { useNavigate } from "react-router-dom";
import { ROUTES, ROUTE_KEYS } from "../../utils/constants";
import { useEffect, useRef, useState } from "react";
import useQueryParams from "../../hooks/useQueryParams";
import { removeQueryParam } from "../../utils/location";
import { ChakraDrawer } from "../../components/Drawer";
import { FormSubmitBar } from "../../components/SubmitBar";
import { ChakraCard } from "../../components/Card";
import { getPathLastItem } from "../../utils/content";
import { Label } from "../../components/Label";
import { useUploadMetadataQuery } from "../../client/queries";
import { formatToGigaBytes } from "../../utils/number";
import { COLOR_BG_PRIMARY_SHADE_FOUR } from "../../styles/colors";

interface PageQueryParams {
  openFileSelection: string | undefined;
}

interface SelectFilesDrawerProps {
  onClose: () => void;
}

const SelectFilesDrawer = (props: SelectFilesDrawerProps) => {
  const { onClose } = props;
  const { project } = usePathParams<{ project: string }>();
  const toast = useToast();
  const navigate = useNavigate();
  const renameProjectModal = useDisclosure();
  const [fileList, setFilelist] = useState<string[]>([]);
  const fileUploadMetadata = useUploadMetadataQuery(fileList);

  useEffect(() => {
    fileUploadMetadata.refetch();
  }, [fileList]);

  const handleFileSelection = async () => {
    if (project === "unnamed") {
      renameProjectModal.onOpen();
      return;
    }

    const files = await open({ multiple: true });

    if (Array.isArray(files)) {
      const res = await uploadDatasets(project, files);
      if (res.status === 200) {
        setFilelist(files);
      } else {
      }
    }
  };

  const submit = async () => {
    const res = await uploadDatasets(project, fileList);
    if (res.status === 200) {
      toast({
        title: `Started processing ${fileList.length} files`,
        position: "top-right",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    }
  };

  const renderFileMetadata = () => {
    if (!fileUploadMetadata.data || fileUploadMetadata.data.length === 0) {
      return null;
    }

    let totalSizeGb = 0;

    return (
      <ChakraCard
        style={{ marginTop: "8px", maxHeight: "55vh", overflowY: "auto" }}
      >
        <Box display={"flex"} justifyContent={"space-between"}>
          <Heading size={"s"}>File</Heading>
          <Heading size={"s"}>Size (GB)</Heading>
        </Box>
        {fileUploadMetadata.data.map((item, i) => {
          totalSizeGb += item.uncompressed_size;
          return (
            <Box key={i} display={"flex"} justifyContent={"space-between"}>
              <div>{getPathLastItem(item.file_path)}</div>
              <div>{formatToGigaBytes(item.uncompressed_size)}</div>
            </Box>
          );
        })}

        <Divider
          marginTop={"6px"}
          marginBottom={"6px"}
          borderColor={COLOR_BG_PRIMARY_SHADE_FOUR}
        />

        <Box display={"flex"} justifyContent={"space-between"}>
          <Heading size={"s"}>Total uncompressed</Heading>
          <Heading size={"s"}>{formatToGigaBytes(totalSizeGb)} GB</Heading>
        </Box>
      </ChakraCard>
    );
  };

  return (
    <Box>
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

      <Button onClick={handleFileSelection}>Select files</Button>
      <Heading size={"s"} marginTop={"16px"}>
        {fileList.length} files selected
      </Heading>
      {renderFileMetadata()}
      <Label
        label={
          <Tooltip label="This option is recommended if the files are large relative to computer's available RAM.">
            Process files in chunks
          </Tooltip>
        }
        containerStyles={{ marginTop: "16px" }}
      >
        <Switch />
      </Label>
      <FormSubmitBar
        mode="STICKY-BOTTOM"
        cancelCallback={onClose}
        submitDisabled={fileList.length === 0}
        submitCallback={submit}
      />
    </Box>
  );
};

export const ProjectDatasetsPage = () => {
  const { openFileSelection } = useQueryParams<PageQueryParams>();
  const selectFilesDrawer = useDisclosure();
  const fileSelectorOpenedLock = useRef(false);

  useEffect(() => {
    if (openFileSelection && Number(openFileSelection) === 1) {
      setTimeout(() => {
        if (fileSelectorOpenedLock.current == false) {
          selectFilesDrawer.onOpen();
          removeQueryParam("openFileSelection");
          fileSelectorOpenedLock.current = true;
        }
      }, 150);
    }
  }, [openFileSelection]);

  return (
    <Box>
      <ChakraDrawer
        title="Add files to project"
        drawerContentStyles={{ maxWidth: "600px" }}
        {...selectFilesDrawer}
      >
        <SelectFilesDrawer {...selectFilesDrawer} />
      </ChakraDrawer>
      <Button onClick={selectFilesDrawer.onOpen}>+ Add</Button>
    </Box>
  );
};
