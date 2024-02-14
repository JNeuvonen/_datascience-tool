import { Box, MenuButton, MenuItem, useToast } from "@chakra-ui/react";
import { ChakraMenu } from "../Menu";
import { useProjectContext } from "../../context/project";
import {
  FaDownload,
  FaFileExcel,
  FaFileImport,
  FaFileSignature,
} from "react-icons/fa6";
import { useLayoutContext } from "../../context/layout";
import { useEffect, useRef, useState } from "react";
import { EditableHeader } from "../EditableHeader";
import { createProject } from "../../client/requests";
import { UNNAMED_PROJECT_PLACEHOLDER } from "../../pages";
import { usePathParams } from "../../hooks/usePathParams";
import { ROUTES, ROUTE_KEYS } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { COLOR_BG_PRIMARY_SHADE_TWO } from "../../styles/colors";
import { MdClearAll } from "react-icons/md";

export const ProjectMenuBar = () => {
  const { project } = usePathParams<{ project: string }>();
  const { selectFilesDrawer, importedFilesDrawer, gridApi, selectedFile } =
    useProjectContext();
  const { setMenuBarHeight, titleBarHeight } = useLayoutContext();

  const [isUnnamed] = useState(project === UNNAMED_PROJECT_PLACEHOLDER);
  const toast = useToast();

  const [projectNameInput, setProjectNameInput] = useState(project);
  const navigate = useNavigate();

  const menuBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (menuBarRef.current) {
      const height = menuBarRef.current?.offsetHeight;
      setMenuBarHeight(height);
    }
  }, []);

  const updateProjectName = async () => {
    if (isUnnamed) {
      const res = await createProject({ name: projectNameInput });
      if (res.status === 200) {
        toast({
          title: "Created project",
          position: "bottom-left",
          status: "info",
          duration: 5000,
          isClosable: true,
        });
        navigate(ROUTES.project.replace(ROUTE_KEYS.project, projectNameInput));
      }
    } else {
    }
  };
  return (
    <Box
      ref={menuBarRef}
      position={"fixed"}
      zIndex={5}
      top={titleBarHeight + 16}
      background={COLOR_BG_PRIMARY_SHADE_TWO}
      width={"100%"}
    >
      <EditableHeader
        defaultValue={selectedFile?.file_name || UNNAMED_PROJECT_PLACEHOLDER}
        setValue={setProjectNameInput}
        value={selectedFile?.file_name || UNNAMED_PROJECT_PLACEHOLDER}
        onInputBlur={updateProjectName}
      />
      <Box gap={"4px"} display={"flex"} marginLeft={"-6px"} marginTop={"2px"}>
        <ChakraMenu menuButton={<MenuButton>File</MenuButton>}>
          <MenuItem icon={<FaFileImport />} onClick={selectFilesDrawer.onOpen}>
            Import data
          </MenuItem>
          <MenuItem
            icon={<FaFileImport />}
            onClick={importedFilesDrawer.onOpen}
          >
            Select imported file
          </MenuItem>
          <MenuItem icon={<FaDownload />}>Export data</MenuItem>
          <MenuItem icon={<FaFileSignature />}>Create pivot dataframe</MenuItem>
          <MenuItem icon={<FaFileExcel />}>Save project</MenuItem>
        </ChakraMenu>
        <ChakraMenu menuButton={<MenuButton>Edit</MenuButton>}>
          <MenuItem
            icon={<MdClearAll />}
            onClick={() => {
              gridApi?.setFilterModel(null);
            }}
          >
            Clear filters
          </MenuItem>
        </ChakraMenu>
        <ChakraMenu menuButton={<MenuButton>Visualize</MenuButton>}>
          <MenuItem icon={<FaFileImport />}>Import data</MenuItem>
          <MenuItem icon={<FaDownload />}>Export data</MenuItem>
          <MenuItem icon={<FaFileExcel />}>Save project</MenuItem>
        </ChakraMenu>
      </Box>
    </Box>
  );
};
