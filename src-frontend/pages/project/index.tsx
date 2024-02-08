import { Box, useToast } from "@chakra-ui/react";
import { ProjectInfoPage } from "./info";
import { ProjectDatasetsPage } from "./datasets";
import { ChakraTabs } from "../../components/Tabs";
import { EditableHeader } from "../../components/EditableHeader";
import { useState } from "react";
import { usePathParams } from "../../hooks/usePathParams";
import { createProject } from "../../client/requests";
import { useNavigate } from "react-router-dom";
import { ROUTES, ROUTE_KEYS } from "../../utils/constants";
import useQueryParams from "../../hooks/useQueryParams";

interface PageQueryParams {
  defaultTab: string | undefined;
  openFileSelection: string | undefined;
}

const TAB_LABELS = ["Info", "Datasets"];
const TABS = [<ProjectInfoPage key={0} />, <ProjectDatasetsPage key={1} />];

export const ProjectIndexPage = () => {
  //UTIL
  const navigate = useNavigate();
  const { project } = usePathParams<{ project: string }>();
  const { defaultTab } = useQueryParams<PageQueryParams>();
  const toast = useToast();

  //STATE
  const [isUnnamed] = useState(project === "unnamed");
  const [projectNameInput, setProjectNameInput] = useState(project);

  const updateProjectName = async () => {
    if (isUnnamed) {
      const res = await createProject({ name: projectNameInput });
      if (res.status === 200) {
        toast({
          title: "Created project",
          position: "top-right",
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
    <Box width={"85%"} margin={"0 auto"}>
      <EditableHeader
        defaultValue={project}
        setValue={setProjectNameInput}
        value={projectNameInput}
        onInputBlur={updateProjectName}
      />
      <ChakraTabs
        labels={TAB_LABELS}
        tabs={TABS}
        style={{ marginTop: "8px" }}
        defaultTab={defaultTab ? Number(defaultTab) : 0}
      />
    </Box>
  );
};
