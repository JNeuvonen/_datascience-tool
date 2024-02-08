import { URLS } from "../utils/endpoints";
import { httpReq } from "../utils/request";

export const uploadDataset = ({ datasetPath }: { datasetPath: string }) => {
  return httpReq({
    url: URLS.project_dataset,
    method: "POST",
    payload: { datasetPath },
  });
};

interface ReqCreateProject {
  name: string;
}

export const createProject = (body: ReqCreateProject) => {
  return httpReq({
    url: URLS.project,
    method: "POST",
    payload: body,
  });
};
