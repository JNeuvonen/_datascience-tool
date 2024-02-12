import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../utils/constants";
import {
  FileMetadata,
  ProjectData,
  getDatafileColumns,
  getFileUploadMetadata,
  getProjectData,
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
    queryKey: [QUERY_KEYS.file_upload_metadata, projectName],
    queryFn: () => getProjectData(projectName),
    enabled: projectName !== UNNAMED_PROJECT_PLACEHOLDER,
  });
}

export function useFileColumnsQuery(
  projectName: string,
  fileName: string
): UseQueryResult<string[] | null, unknown> {
  return useQuery<string[] | null, unknown>({
    queryKey: [QUERY_KEYS.file_upload_metadata, projectName, fileName],
    queryFn: () => getDatafileColumns(projectName, fileName),
    enabled: projectName !== UNNAMED_PROJECT_PLACEHOLDER && !!fileName,
  });
}
