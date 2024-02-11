import { Box, useToast } from "@chakra-ui/react";
import { ProjectDatasetsPage } from "./datasets";
import { EditableHeader } from "../../components/EditableHeader";
import { useState } from "react";
import { usePathParams } from "../../hooks/usePathParams";
import { createProject } from "../../client/requests";
import { useNavigate } from "react-router-dom";
import { ROUTES, ROUTE_KEYS } from "../../utils/constants";
import { UNNAMED_PROJECT_PLACEHOLDER } from "..";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import { ProjectMenuBar } from "../../components/project/MenuBar";

export interface ProjectPageQueryParams {
  defaultTab: string | undefined;
  openFileSelection: string | undefined;
}

export const ProjectIndexPage = () => {
  //UTIL
  const navigate = useNavigate();
  const { project } = usePathParams<{ project: string }>();
  const toast = useToast();

  //STATE
  const [isUnnamed] = useState(project === UNNAMED_PROJECT_PLACEHOLDER);
  const [projectNameInput, setProjectNameInput] = useState(project);

  useBreadcrumbs(
    [
      { label: "Projects", href: "/" },
      { label: project, href: window.location.pathname },
    ],
    [project]
  );

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
      <EditableHeader
        defaultValue={project}
        setValue={setProjectNameInput}
        value={projectNameInput}
        onInputBlur={updateProjectName}
      />
      <ProjectMenuBar />
      <ProjectDatasetsPage />
    </Box>
  );
};
