import React, { createContext, ReactNode, useContext, useState } from "react";
import { ProjectPageQueryParams } from "../pages/project";
import useQueryParams from "../hooks/useQueryParams";
import { useDisclosure } from "@chakra-ui/react";

type UseDisclosureReturn = ReturnType<typeof useDisclosure>;

interface ProjectContextType {
  tabIndex: number;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
  selectFilesDrawer: UseDisclosureReturn;
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
  return (
    <ProjectContext.Provider
      value={{
        tabIndex,
        setTabIndex,
        selectFilesDrawer,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => useContext(ProjectContext);
