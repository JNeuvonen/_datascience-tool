import React, { createContext, ReactNode, useContext, useState } from "react";
import { ProjectPageQueryParams } from "../pages/project";
import useQueryParams from "../hooks/useQueryParams";
import { useDisclosure } from "@chakra-ui/react";
import { usePathParams } from "../hooks/usePathParams";
import { useProjectQuery } from "../client/queries";
import { UseQueryResult } from "@tanstack/react-query";
import { ProjectData } from "../client/requests";

type UseDisclosureReturn = ReturnType<typeof useDisclosure>;

interface ProjectContextType {
  tabIndex: number;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
  selectFilesDrawer: UseDisclosureReturn;
  importedFilesDrawer: UseDisclosureReturn;
  projectQuery: UseQueryResult<ProjectData | null, unknown>;
}

export const ProjectContext = createContext<ProjectContextType>(
  {} as ProjectContextType
);

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({
  children,
}) => {
  const { defaultTab } = useQueryParams<ProjectPageQueryParams>();
  const [tabIndex, setTabIndex] = useState(Number(defaultTab) || 0);
  const selectFilesDrawer = useDisclosure();
  const importedFilesDrawer = useDisclosure();
  const { project } = usePathParams<{ project: string }>();
  const projectQuery = useProjectQuery(project);
  return (
    <ProjectContext.Provider
      value={{
        tabIndex,
        setTabIndex,
        selectFilesDrawer,
        projectQuery,
        importedFilesDrawer,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => useContext(ProjectContext);
