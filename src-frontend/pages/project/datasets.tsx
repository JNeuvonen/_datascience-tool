import { Box, Button } from "@chakra-ui/react";
import { open } from "@tauri-apps/api/dialog";
import { ApiResponse } from "../../utils/request";
import { uploadDataset } from "../../client/requests";

export const ProjectDatasetsPage = () => {
  const handleFileSelection = async () => {
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
    </Box>
  );
};
