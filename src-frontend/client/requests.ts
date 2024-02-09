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
