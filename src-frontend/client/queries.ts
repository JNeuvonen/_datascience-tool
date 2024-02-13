import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../utils/constants";
import {
  FileMetadata,
  Project,
  ProjectData,
  getDatafileColumns,
  getFileUploadMetadata,
  getProjectData,
  getProjects,
} from "./requests";
import { UNNAMED_PROJECT_PLACEHOLDER } from "../pages";

export function useUploadMetadataQuery(
  files: string[]
): UseQueryResult<FileMetadata[] | null, unknown> {
  return useQuery<FileMetadata[] | null, unknown>({
    queryKey: [QUERY_KEYS.file_upload_metadata, files],
    queryFn: () => getFileUploadMetadata(files),
    enabled: files.length > 0,
  });
}

export function useProjectQuery(
  projectName: string
): UseQueryResult<ProjectData | null, unknown> {
  return useQuery<ProjectData | null, unknown>({
    queryKey: [QUERY_KEYS.project, projectName],
    queryFn: () => getProjectData(projectName),
    enabled: projectName !== UNNAMED_PROJECT_PLACEHOLDER,
  });
}

export type SqlDtype =
  | "NULL"
  | "INTEGER"
  | "REAL"
  | "TEXT"
  | "BLOB"
  | "DATE"
  | "CATEGORY";

export type ColumnInfo = {
  name: string;
  type: SqlDtype;
  categorical_values: string[];
};

export function useFileColumnsQuery(
  projectName: string,
  fileName: string
): UseQueryResult<ColumnInfo[] | null, unknown> {
  return useQuery<ColumnInfo[] | null, unknown>({
    queryKey: [QUERY_KEYS.file_upload_metadata, projectName, fileName],
    queryFn: () => getDatafileColumns(projectName, fileName),
    enabled: projectName !== UNNAMED_PROJECT_PLACEHOLDER && !!fileName,
  });
}

export function useProjectsQuery(): UseQueryResult<
  ProjectData[] | null,
  unknown
> {
  return useQuery<ProjectData[] | null, unknown>({
    queryKey: [QUERY_KEYS.projects],
    queryFn: () => getProjects(),
  });
}
