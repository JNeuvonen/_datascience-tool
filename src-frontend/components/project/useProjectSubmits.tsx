import { DataFile, putOnDatafile } from "../../client/requests";
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
