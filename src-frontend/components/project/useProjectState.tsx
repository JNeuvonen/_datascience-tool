import { useDisclosure } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { DataFile } from "../../client/requests";
import { GridApi } from "ag-grid-community";
import { usePathParams } from "../../hooks/usePathParams";
import { SwiperRef } from "swiper/react";

export type UIModes = "default" | "create-dataframe";

export const useProjectState = () => {
  const setJoinColModal = useDisclosure();
  const renameDatafileModal = useDisclosure();
  const selectFilesDrawer = useDisclosure();
  const deleteFileModal = useDisclosure();
  const importedFilesDrawer = useDisclosure();
  const renameProjectModal = useDisclosure();
  const mergeDataframesModal = useDisclosure();

  const [selectedFile, setSelectedFile] = useState<DataFile | null>(null);
  const [selectedFileContext, setSelectedFileContext] =
    useState<DataFile | null>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const { project } = usePathParams<{ project: string }>();
  const fileSwiperRef = useRef<SwiperRef | null>(null);
  const [swipeToLast, setSwipeToLast] = useState(false);

  return {
    setJoinColModal,
    renameDatafileModal,
    selectFilesDrawer,
    importedFilesDrawer,
    selectedFile,
    setSelectedFile,
    gridApi,
    setGridApi,
    project,
    renameProjectModal,
    selectedFileContext,
    setSelectedFileContext,
    deleteFileModal,
    fileSwiperRef,
    swipeToLast,
    setSwipeToLast,
    mergeDataframesModal,
  };
};
