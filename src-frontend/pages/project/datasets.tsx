import { Box, Button } from "@chakra-ui/react";
import { open } from "@tauri-apps/api/dialog";

export const ProjectDatasetsPage = () => {
  const handleFileSelection = async () => {
    const files = await open({ multiple: true });
  };

  return (
    <Box>
      <Button onClick={handleFileSelection}>test</Button>
    </Box>
  );
};
