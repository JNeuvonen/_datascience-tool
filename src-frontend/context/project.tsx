import React, { createContext, ReactNode, useContext } from "react";
import { useDisclosure } from "@chakra-ui/react";
import {
  ColumnInfo,
  useFileColumnsQuery,
  useProjectQuery,
} from "../client/queries";
import { UseQueryResult } from "@tanstack/react-query";
import { DataFile, ProjectData } from "../client/requests";
import { GridApi } from "ag-grid-community";
import { useMessageListener } from "../hooks/useMessageListener";
import { DOM_EVENT_CHANNELS } from "../utils/constants";
import { ProjectUXHelper, useProjectState } from "../components/project";
import { createDatafile } from "../components/project/useProjectSubmits";
import { UNNAMED_FILE_PLACEHOLDER } from "../pages";

type UseDisclosureReturn = ReturnType<typeof useDisclosure>;

export interface ProjectContextType {
  selectFilesDrawer: UseDisclosureReturn;
  deleteFileModal: UseDisclosureReturn;
  importedFilesDrawer: UseDisclosureReturn;
  setJoinColModal: UseDisclosureReturn;
  renameDatafileModal: UseDisclosureReturn;
  renameProjectModal: UseDisclosureReturn;
  projectQuery: UseQueryResult<ProjectData | null, unknown>;
  fileColumnsQuery: UseQueryResult<ColumnInfo[] | null, unknown>;
  selectedFile: DataFile | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<DataFile | null>>;
  selectedFileContext: DataFile | null;
  setSelectedFileContext: React.Dispatch<React.SetStateAction<DataFile | null>>;
  setGridApi: React.Dispatch<React.SetStateAction<GridApi<any> | null>>;
  gridApi: GridApi | null;
  selectDatafile: (fileName: string) => void;
  setNewDataframeUIMode: () => void;
  getDatafileByName: (fileName: string) => DataFile | null;
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
  const {
    selectFilesDrawer,
    importedFilesDrawer,
    selectedFile,
    setSelectedFile,
    selectedFileContext,
    setSelectedFileContext,
    gridApi,
    setGridApi,
    project,
    setJoinColModal,
    renameDatafileModal,
    renameProjectModal,
    deleteFileModal,
  } = useProjectState();

  const projectQuery = useProjectQuery(project);
  const fileColumnsQuery = useFileColumnsQuery(
    project,
    selectedFile?.file_name || ""
  );

  const setNewDataframeUIMode = () => {
    setSelectedFile(null);

    if (!projectQuery.data) return;
    createDatafile(
      {
        project_id: projectQuery.data.project.id,
        file_name: UNNAMED_FILE_PLACEHOLDER,
      },
      () => {
        projectQuery.refetch();
      }
    );
  };

  const getDatafileByName = (fileName: string) => {
    let ret = null;
    projectQuery.data?.datafiles.forEach((item) => {
      if (item.file_name === fileName) {
        ret = item;
      }
    });
    return ret;
  };

  const selectDatafile = (fileName: string) => {
    const datafile = getDatafileByName(fileName);
    setSelectedFile(datafile);
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
        setNewDataframeUIMode,
        setJoinColModal,
        renameDatafileModal,
        renameProjectModal,
        selectedFileContext,
        setSelectedFileContext,
        getDatafileByName,
        deleteFileModal,
      }}
    >
      <ProjectUXHelper />
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => useContext(ProjectContext);
