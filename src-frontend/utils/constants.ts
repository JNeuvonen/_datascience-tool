export const ROUTE_KEYS = {
  project: ":project",
};

export const ROUTES = {
  project: `/project/${ROUTE_KEYS.project}`,
  settings: "/settings",
};

export const BACKEND_STREAM_MESSAGES = {
  upload_file: "MESSAGE_UPLOAD_FILES",
  file_upload_finish: "MESSAGE_FILE_UPLOAD_FINISH",
};

export const DOM_EVENT_CHANNELS = {
  refetch_component: "refetch_component",
  upload_file: "upload_file",
};

export const QUERY_KEYS = {
  file_upload_metadata: "file-upload-metadata",
};

export const TAURI_COMMANDS = {
  fetch_env: "fetch_env",
  fetch_platform: "fetch_platform",
};
