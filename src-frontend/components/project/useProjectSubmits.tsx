import {
  DataFile,
  delOnDatafile,
  postOnDatafile,
  putOnDatafile,
  putUpdateDfJoinCol,
  reqMergeDataframes,
} from "../../client/requests";
import { createStandaloneToast } from "@chakra-ui/react";
const { toast } = createStandaloneToast();

export const updateDatafile = async (
  datafile: DataFile,
  successCallback?: () => void
) => {
  const res = await putOnDatafile(datafile);

  if (res?.status === 200) {
    toast({
      title: "Updated datafile info",
      position: "bottom-left",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
    if (successCallback) successCallback();
  }
};

export const deleteDatafile = async (
  id: number,
  successCallback?: () => void
) => {
  const res = await delOnDatafile(id);

  if (res?.status === 200) {
    toast({
      title: "Deleted a datafile",
      position: "bottom-left",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
    if (successCallback) successCallback();
  }
};

export interface CreateDatafile {
  project_id: number;
  file_name: string;
}
export const createDatafile = async (
  body: CreateDatafile,
  successCallback?: () => void
) => {
  const res = await postOnDatafile(body);
  if (res?.status === 200) {
    if (successCallback) successCallback();
  }
  return res;
};

export const mergeDataframes = async (
  fileId: number,
  dataframes: string[],
  successCallback?: () => void
) => {
  const res = await reqMergeDataframes(fileId, dataframes);

  if (res.status === 200) {
    if (successCallback) successCallback();
  }
};

export const dfUpdateJoinCol = async (
  id: number,
  joinCol: string,
  successCallback?: () => void
) => {
  const res = await putUpdateDfJoinCol(id, joinCol);

  if (res.status === 200) {
    toast({
      title: "Updated join column",
      position: "bottom-left",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
    if (successCallback) successCallback();
  }
};

export async function saveDatasetFile(id: number, filters: string[]) {
  const response = await fetch(URLS.downloadDataset(datasetName));
  if (!response.ok) throw new Error("Network response was not ok.");

  const blob = await response.blob();

  if (window.__TAURI__) {
    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const filePath = await save({ defaultPath: `${datasetName}.csv` });
    if (filePath) {
      await writeBinaryFile({ path: filePath, contents: uint8Array });
    }
  } else {
    saveAs(blob, `${datasetName}.csv`);
  }
}
