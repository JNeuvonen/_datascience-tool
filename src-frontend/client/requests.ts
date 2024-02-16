import { CreateDatafile } from "../components/project/useProjectSubmits";
import { REST_API_URL } from "../utils/endpoints";
import { httpReq } from "../utils/request";

export const uploadDataset = (
  projectName: string,
  { datasetPath }: { datasetPath: string }
) => {
  return httpReq({
    url: REST_API_URL.project_upload_dataset(projectName),
    method: "POST",
    payload: { datasetPath },
  });
};

export const uploadDatasets = (projectName: string, filePaths: string[]) => {
  return httpReq({
    url: REST_API_URL.project_upload_datasets(projectName),
    method: "POST",
    payload: { dataset_paths: filePaths },
  });
};

interface ReqCreateProject {
  name: string;
}

export const createProject = (body: ReqCreateProject) => {
  return httpReq({
    url: REST_API_URL.project,
    method: "POST",
    payload: body,
  });
};

export interface FileMetadata {
  file_path: string;
  uncompressed_size: number;
}

export interface ResFileUploadMetadata {
  res: {
    data: FileMetadata[];
  };
  status: number;
}

export const getFileUploadMetadata = async (files: string[]) => {
  const res: ResFileUploadMetadata = await httpReq({
    url: REST_API_URL.file_upload_metadata,
    method: "POST",
    payload: { file_paths: files },
  });

  if (res.status === 200) {
    return res.res["data"];
  }
  return null;
};

export interface DataFile {
  file_name: string;
  id: number;
  size_bytes: number;
  project_id: number;
  was_import: boolean;
  merged_dataframes: string[] | null;
}
export interface Project {
  name: string;
  id: number;
  join_column: string | null;
}

export interface ProjectMetadataJoinCol {
  common_columns: string[];
  files_with_no_join: "N/A" | string[];
}

export interface ProjectMetadata {
  join_col: ProjectMetadataJoinCol;
}

export interface ProjectData {
  project: Project;
  datafiles: DataFile[];
  metadata: ProjectMetadata;
}

export interface ResProject {
  res: {
    data: ProjectData;
  };
  status: number;
}

export const getProjectData = async (projectName: string) => {
  const res: ResProject = await httpReq({
    url: REST_API_URL.get_project(projectName),
    method: "GET",
  });

  if (res.status === 200) {
    return res.res["data"];
  }
  return null;
};

export const getProjectPagination = async (
  projectName: string,
  fileName: string,
  page: number,
  pageSize: number,
  filters: object,
  options: { signal: AbortSignal }
) => {
  const res = await httpReq({
    url: REST_API_URL.project_file_pagination(
      projectName,
      fileName,
      page,
      pageSize,
      JSON.stringify(filters)
    ),
    method: "GET",
    signal: options.signal,
    options: {
      signal: options.signal,
    },
    errorShouldNotifyUI: false,
  });

  if (res.status === 200) {
    return res.res;
  }
  return null;
};

export const getDatafileColumns = async (
  projectName: string,
  fileName: string
) => {
  const res = await httpReq({
    url: REST_API_URL.project_file_by_name(projectName, fileName),
    method: "GET",
  });

  if (res.status === 200) {
    return res.res["data"];
  }
  return null;
};

export const getProjects = async () => {
  const res = await httpReq({
    url: REST_API_URL.project,
    method: "GET",
  });

  if (res.status === 200) {
    return res.res["data"];
  }
  return null;
};

export const setJoinCol = async (projectName: string, joinCol: string) => {
  const res = await httpReq({
    url: REST_API_URL.set_join_col(projectName, joinCol),
    method: "PUT",
  });

  if (res.status === 200) {
    return res.res;
  }
  return null;
};

export const putOnDatafile = async (datafile: DataFile) => {
  const res = await httpReq({
    url: REST_API_URL.datafile(),
    method: "PUT",
    payload: datafile,
  });

  if (res.status === 200) {
    return res;
  }
  return null;
};

export const delOnDatafile = async (id: number) => {
  const res = await httpReq({
    url: REST_API_URL.datafile_id(id),
    method: "DELETE",
  });

  if (res.status === 200) {
    return res;
  }
  return null;
};

export const postOnDatafile = async (body: CreateDatafile) => {
  const res = await httpReq({
    url: REST_API_URL.datafile(),
    method: "POST",
    payload: body,
  });

  if (res.status === 200) {
    return res;
  }

  return null;
};
