import { Box, MenuButton, MenuItem } from "@chakra-ui/react";
import { ChakraMenu } from "../Menu";
import { useProjectContext } from "../../context/project";
import {
  FaDownload,
  FaFileExcel,
  FaFileImport,
  FaFileSignature,
} from "react-icons/fa6";

export const ProjectMenuBar = () => {
  const { selectFilesDrawer, importedFilesDrawer } = useProjectContext();
  return (
    <Box gap={"4px"} display={"flex"} marginLeft={"-6px"} marginTop={"2px"}>
      <ChakraMenu menuButton={<MenuButton>File</MenuButton>}>
        <MenuItem icon={<FaFileImport />} onClick={selectFilesDrawer.onOpen}>
          Import data
        </MenuItem>
        <MenuItem icon={<FaFileImport />} onClick={importedFilesDrawer.onOpen}>
          View imported files
        </MenuItem>
        <MenuItem icon={<FaDownload />}>Export data</MenuItem>
        <MenuItem icon={<FaFileSignature />}>Create pivot dataframe</MenuItem>
        <MenuItem icon={<FaFileExcel />}>Save project</MenuItem>
      </ChakraMenu>
      <ChakraMenu menuButton={<MenuButton>Visualize</MenuButton>}>
        <MenuItem icon={<FaFileImport />}>Import data</MenuItem>
        <MenuItem icon={<FaDownload />}>Export data</MenuItem>
        <MenuItem icon={<FaFileExcel />}>Save project</MenuItem>
      </ChakraMenu>
    </Box>
  );
};
