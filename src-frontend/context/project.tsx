import React, { createContext, ReactNode, useContext, useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { usePathParams } from "../hooks/usePathParams";
import {
  ColumnInfo,
  useFileColumnsQuery,
  useProjectQuery,
} from "../client/queries";
import { UseQueryResult } from "@tanstack/react-query";
import { DataFile, ProjectData } from "../client/requests";
import { GridApi } from "ag-grid-community";
import { ProjectUXHelper } from "../components/project/NotificationsHelper";
import { useMessageListener } from "../hooks/useMessageListener";
import { DOM_EVENT_CHANNELS } from "../utils/constants";

type UseDisclosureReturn = ReturnType<typeof useDisclosure>;

export interface ProjectContextType {
  selectFilesDrawer: UseDisclosureReturn;
  importedFilesDrawer: UseDisclosureReturn;
  projectQuery: UseQueryResult<ProjectData | null, unknown>;
  fileColumnsQuery: UseQueryResult<ColumnInfo[] | null, unknown>;
  selectedFile: DataFile | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<DataFile | null>>;
  setGridApi: React.Dispatch<React.SetStateAction<GridApi<any> | null>>;
  gridApi: GridApi | null;
  selectDatafile: (fileName: string) => void;
  uiMode: UIModes;
  setNewDataframeUIMode: () => void;
}

export const ProjectContext = createContext<ProjectContextType>(
  {} as ProjectContextType
);

interface ProjectProviderProps {
  children: ReactNode;
}

export type UIModes = "default" | "create-dataframe";

export const ProjectProvider: React.FC<ProjectProviderProps> = ({
  children,
}) => {
  const [uiMode, setUiMode] = useState<UIModes>("default");

  const [selectedFile, setSelectedFile] = useState<DataFile | null>(null);
  const { project } = usePathParams<{ project: string }>();

  const projectQuery = useProjectQuery(project);
  const fileColumnsQuery = useFileColumnsQuery(
    project,
    selectedFile?.file_name || ""
  );

  const selectFilesDrawer = useDisclosure();
  const importedFilesDrawer = useDisclosure();
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  const setNewDataframeUIMode = () => {
    setSelectedFile(null);
    setUiMode("create-dataframe");
  };

  const selectDatafile = (fileName: string) => {
    projectQuery.data?.datafiles.forEach((item) => {
      if (item.file_name === fileName) {
        setSelectedFile(item);
      }
    });
  };

  useMessageListener({
    messageName: DOM_EVENT_CHANNELS.refetch_component,
    messageCallback: () => {
      projectQuery.refetch();
    },
  });
  return (
    <ProjectContext.Provider
      value={{
        selectFilesDrawer,
        projectQuery,
        importedFilesDrawer,
        selectedFile,
        setSelectedFile,
        fileColumnsQuery,
        gridApi,
        setGridApi,
        selectDatafile,
        uiMode,
        setNewDataframeUIMode,
      }}
    >
      <ProjectUXHelper />
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => useContext(ProjectContext);
