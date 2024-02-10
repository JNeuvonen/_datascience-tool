import React, { createContext, ReactNode, useContext, useState } from "react";
import { ProjectPageQueryParams } from "../pages/project";
import useQueryParams from "../hooks/useQueryParams";

interface ProjectContextType {
  tabIndex: number;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
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
  return (
    <ProjectContext.Provider
      value={{
        tabIndex,
        setTabIndex,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => useContext(ProjectContext);
