import {
  DataFile,
  delOnDatafile,
  postOnDatafile,
  putOnDatafile,
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
