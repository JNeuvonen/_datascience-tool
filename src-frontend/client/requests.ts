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
