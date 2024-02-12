import { Box } from "@chakra-ui/react";
import { ProjectDatasetsPage } from "./datasets";
import { usePathParams } from "../../hooks/usePathParams";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import { ProjectMenuBar } from "../../components/project/MenuBar";

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
