import {
  Box,
  Divider,
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
  const [isUnnamed] = useState(project === "unnamed");
  const [projectNameInput, setProjectNameInput] = useState(project);
  const { tabIndex, setTabIndex } = useProjectContext();
  const { updateBreadCrumbsContent } = useLayoutContext();

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
  }, [project, updateBreadCrumbsContent]);

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
      <Tabs
        index={tabIndex}
        onChange={setTabIndex}
        isFitted
        variant="enclosed"
        overflowX={"auto"}
      >
        <PageTabs />
        <SideBarProject />
        <EditableHeader
          defaultValue={project}
          setValue={setProjectNameInput}
          value={projectNameInput}
          onInputBlur={updateProjectName}
        />
        <TabPanels>
          {TABS.map((tabContent, index) => (
            <TabPanel
              key={index}
              hidden={index !== tabIndex}
              style={{ padding: 0 }}
            >
              {index === tabIndex && tabContent}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
};
