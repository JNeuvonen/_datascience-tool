import { Box, MenuButton, MenuItem, Tooltip, useToast } from "@chakra-ui/react";
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
  const {
    selectFilesDrawer,
    importedFilesDrawer,
    gridApi,
    selectedFile,
    mergeDataframesModal,
  } = useProjectContext();
  const { setMenuBarHeight, titleBarHeight } = useLayoutContext();

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
    if (project === UNNAMED_PROJECT_PLACEHOLDER) {
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
        defaultValue={project || UNNAMED_PROJECT_PLACEHOLDER}
        setValue={setProjectNameInput}
        value={project || UNNAMED_PROJECT_PLACEHOLDER}
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
          <MenuItem icon={<FaFileSignature />}>Create a new dataframe</MenuItem>
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
          <MenuItem
            icon={<MdClearAll />}
            onClick={() => {
              gridApi?.setFilterModel(null);
            }}
          >
            Drop columns
          </MenuItem>
          <MenuItem
            icon={<MdClearAll />}
            onClick={() => {
              gridApi?.setFilterModel(null);
            }}
          >
            Clone current file
          </MenuItem>
          <MenuItem
            icon={<MdClearAll />}
            onClick={() => {
              gridApi?.setFilterModel(null);
            }}
          >
            Filter columns
          </MenuItem>
        </ChakraMenu>
        <ChakraMenu
          menuButton={
            <Tooltip
              label="Select a file first"
              isDisabled={selectedFile !== null}
            >
              <MenuButton disabled={selectedFile === null}>
                Dataframe
              </MenuButton>
            </Tooltip>
          }
        >
          <MenuItem
            icon={<MdClearAll />}
            onClick={() => {
              gridApi?.setFilterModel(null);
            }}
          >
            Clear filters
          </MenuItem>
          <MenuItem icon={<MdClearAll />} onClick={mergeDataframesModal.onOpen}>
            Merge dataframes
          </MenuItem>
          <MenuItem
            icon={<MdClearAll />}
            onClick={() => {
              gridApi?.setFilterModel(null);
            }}
          >
            Drop columns
          </MenuItem>
          <MenuItem
            icon={<MdClearAll />}
            onClick={() => {
              gridApi?.setFilterModel(null);
            }}
          >
            Clone current file
          </MenuItem>
          <MenuItem
            icon={<MdClearAll />}
            onClick={() => {
              gridApi?.setFilterModel(null);
            }}
          >
            Filter columns
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
