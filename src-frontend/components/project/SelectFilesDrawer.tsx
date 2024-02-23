import {
  Box,
  Button,
  Divider,
  Heading,
  Switch,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { open } from "@tauri-apps/api/dialog";
import { useEffect, useState } from "react";
import { FaFileExport } from "react-icons/fa6";
import { useUploadMetadataQuery } from "../../client/queries";
import { uploadDatasets } from "../../client/requests";
import { useProjectContext } from "../../context/project";
import { usePathParams } from "../../hooks/usePathParams";
import { UNNAMED_PROJECT_PLACEHOLDER } from "../../pages";
import { COLOR_BG_PRIMARY_SHADE_FOUR } from "../../styles/colors";
import { getPathLastItem } from "../../utils/content";
import { formatToGigaBytes } from "../../utils/number";
import { ChakraCard } from "../Card";
import { Label } from "../Label";
import { FormSubmitBar } from "../SubmitBar";

interface SelectFilesDrawerProps {
  onClose: () => void;
}

export const SelectFilesDrawer = (props: SelectFilesDrawerProps) => {
  const { renameProjectModal } = useProjectContext();
  const { onClose } = props;
  const { project } = usePathParams<{ project: string }>();
  const toast = useToast();
  const [fileList, setFilelist] = useState<string[]>([]);
  const fileUploadMetadata = useUploadMetadataQuery(fileList);

  useEffect(() => {
    fileUploadMetadata.refetch();
  }, [fileList]);

  const handleFileSelection = async () => {
    if (project === UNNAMED_PROJECT_PLACEHOLDER) {
      renameProjectModal.onOpen();
      return;
    }

    const files = await open({ multiple: true });

    if (Array.isArray(files)) {
      setFilelist(files);
    }
  };

  const submit = async () => {
    const res = await uploadDatasets(project, fileList);
    if (res.status === 200) {
      toast({
        title: `Started processing ${fileList.length} files`,
        position: "bottom-left",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
      onClose();
      setFilelist([]);
    } else {
      setFilelist([]);
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
      <Button leftIcon={<FaFileExport />} onClick={handleFileSelection}>
        Select files
      </Button>
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
