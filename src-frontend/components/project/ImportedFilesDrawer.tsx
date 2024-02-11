import { Box, Heading } from "@chakra-ui/react";

interface SelectFilesDrawerProps {
  onClose: () => void;
}

export const ImportedFilesDrawer = () => {
  return (
    <Box>
      <Heading size={"md"}>Imported files</Heading>
    </Box>
  );
};
