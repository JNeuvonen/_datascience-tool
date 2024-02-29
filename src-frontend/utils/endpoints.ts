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
  get_project: (projectName: string) => `${BASE_URL}/${PROJECT}/${projectName}`,
  log_stream: "ws://localhost:8000/streams/subscribe-log",
  project_file_pagination: (
    projectName: string,
    fileName: string,
    page: number,
    page_size: number,
    filters: string
  ) =>
    `${BASE_URL}/${PROJECT}/${projectName}/row-pagination/${fileName}?page=${page}&page_size=${page_size}&filters=${filters}`,
  project_file_by_name: (projectName: string, fileName: string) =>
    `${BASE_URL}/${PROJECT}/${projectName}/file/${fileName}`,
  set_join_col: (projectName: string, joinCol: string) =>
    `${BASE_URL}/${PROJECT}/${projectName}/join-col?join_col=${joinCol}`,
  datafile: () => `${BASE_URL}/datafile/`,
  datafile_id: (id: number) => `${BASE_URL}/datafile/${id}`,
  merge_datafames: (id: number) => `${BASE_URL}/datafile/merge/${id}`,
  df_set_join_col: (id: number, joinCol: string) =>
    `${BASE_URL}/datafile/set-join-col/${id}?join_col=${joinCol}`,
  df_export: (id: number, filters: string) =>
    `${BASE_URL}/datafile/export/${id}?filters=${filters}`,
};
