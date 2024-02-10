import {
  Box,
  Divider,
  Heading,
  MenuButton,
  MenuItem,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from "@chakra-ui/react";
import { ProjectInfoPage } from "./info";
import { ProjectDatasetsPage } from "./datasets";
import { EditableHeader } from "../../components/EditableHeader";
import { useEffect, useState } from "react";
import { usePathParams } from "../../hooks/usePathParams";
import { createProject } from "../../client/requests";
import { useNavigate } from "react-router-dom";
import { ROUTES, ROUTE_KEYS } from "../../utils/constants";
import { SideBarProject } from "../../components/SideBarProject";
import { useProjectContext } from "../../context/project";
import { useLayoutContext } from "../../context/layout";
import { COLOR_BG_PRIMARY_SHADE_TWO } from "../../styles/colors";
import { Breadcrumbs } from "../../components/BreadCrumbs";
import { ChakraMenu } from "../../components/Menu";
import {
  FaDownload,
  FaFileExcel,
  FaFileImport,
  FaFileSignature,
} from "react-icons/fa6";
import { UNNAMED_PROJECT_PLACEHOLDER } from "..";

export interface ProjectPageQueryParams {
  defaultTab: string | undefined;
  openFileSelection: string | undefined;
}

const TABS = [<ProjectInfoPage key={0} />, <ProjectDatasetsPage key={1} />];
const TAB_LABELS = ["Info", "Datasets"];
const TABS_HEIGHT = 45;

const PageTabs = () => {
  const { tabIndex, setTabIndex } = useProjectContext();
  const { setPageTabsHeight, titleBarHeight, sideBarWidth } =
    useLayoutContext();

  useEffect(() => {
    setPageTabsHeight(TABS_HEIGHT);
    return () => setPageTabsHeight(0);
  }, []);

  return (
    <Box
      position={"fixed"}
      top={titleBarHeight}
      left={0}
      bg={COLOR_BG_PRIMARY_SHADE_TWO}
      width={`calc(100% - ${sideBarWidth}px)`}
      marginLeft={sideBarWidth}
      padding={"8px"}
      zIndex={5}
    >
      <Tabs index={tabIndex} onChange={setTabIndex} isFitted>
        <TabList style={{ width: "max-content" }}>
          {TAB_LABELS.map((label, index) => (
            <Tab key={index}>{label}</Tab>
          ))}
        </TabList>
      </Tabs>
    </Box>
  );
};

export const ProjectIndexPage = () => {
  //UTIL
  const navigate = useNavigate();
  const { project } = usePathParams<{ project: string }>();
  const toast = useToast();

  //STATE
  const [isUnnamed] = useState(project === UNNAMED_PROJECT_PLACEHOLDER);
  const [projectNameInput, setProjectNameInput] = useState(project);
  const { updateBreadCrumbsContent } = useLayoutContext();
  const { selectFilesDrawer } = useProjectContext();

  useEffect(() => {
    updateBreadCrumbsContent(
      <Breadcrumbs
        items={[
          { label: "New project", href: "/" },
          { label: project, href: window.location.pathname },
        ]}
      />
    );

    return () => updateBreadCrumbsContent(null);
  }, [project]);

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
    <Box>
      <SideBarProject />
      <EditableHeader
        defaultValue={project}
        setValue={setProjectNameInput}
        value={projectNameInput}
        onInputBlur={updateProjectName}
      />

      <Box gap={"4px"} display={"flex"} marginLeft={"-6px"} marginTop={"2px"}>
        <ChakraMenu menuButton={<MenuButton>File</MenuButton>}>
          <MenuItem icon={<FaFileImport />} onClick={selectFilesDrawer.onOpen}>
            Import data
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

      <ProjectDatasetsPage />
    </Box>
  );
};
