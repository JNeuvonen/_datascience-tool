import React, { createContext, ReactNode, useContext, useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { usePathParams } from "../hooks/usePathParams";
import { useFileColumnsQuery, useProjectQuery } from "../client/queries";
import { UseQueryResult } from "@tanstack/react-query";
import { DataFile, ProjectData } from "../client/requests";

type UseDisclosureReturn = ReturnType<typeof useDisclosure>;

interface ProjectContextType {
  selectFilesDrawer: UseDisclosureReturn;
  importedFilesDrawer: UseDisclosureReturn;
  projectQuery: UseQueryResult<ProjectData | null, unknown>;
  fileColumnsQuery: UseQueryResult<string[] | null, unknown>;
  selectedFile: DataFile | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<DataFile | null>>;
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
  const [selectedFile, setSelectedFile] = useState<DataFile | null>(null);
  const { project } = usePathParams<{ project: string }>();

  const projectQuery = useProjectQuery(project);
  const fileColumnsQuery = useFileColumnsQuery(
    project,
    selectedFile?.file_name || ""
  );

  const selectFilesDrawer = useDisclosure();
  const importedFilesDrawer = useDisclosure();

  return (
    <ProjectContext.Provider
      value={{
        selectFilesDrawer,
        projectQuery,
        importedFilesDrawer,
        selectedFile,
        setSelectedFile,
        fileColumnsQuery,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => useContext(ProjectContext);
