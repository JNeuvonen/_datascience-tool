const PROJECT = "project";
const DATASET = "dataset";

export const BASE_URL = "http://localhost:8000";

export const REST_API_URL = {
  project_upload_dataset: (projectName: string) =>
    `${BASE_URL}/${PROJECT}/${projectName}/${DATASET}`,
  project_upload_datasets: (projectName: string) =>
    `${BASE_URL}/${PROJECT}/${projectName}/datasets`,
  project: `${BASE_URL}/${PROJECT}`,
  file_upload_metadata: `${BASE_URL}/${PROJECT}/size-of-uploads`,
  log_stream: "ws://localhost:8000/streams/subscribe-log",
};
