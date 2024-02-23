import { Box } from "@chakra-ui/react";
import { ProjectMenuBar } from "../../components/project/MenuBar";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import { usePathParams } from "../../hooks/usePathParams";
import { ProjectDatasetsPage } from "./datasets";

export interface ProjectPageQueryParams {
  defaultTab: string | undefined;
  openFileSelection: string | undefined;
}

export const ProjectIndexPage = () => {
  const { project } = usePathParams<{ project: string }>();

  useBreadcrumbs(
    [
      { label: "Projects", href: "/" },
      { label: project, href: window.location.pathname },
    ],
    [project]
  );

  return (
    <Box>
      <ProjectMenuBar />
      <ProjectDatasetsPage />
    </Box>
  );
};
