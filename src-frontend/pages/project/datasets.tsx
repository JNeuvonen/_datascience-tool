import { Box } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { ChakraDrawer } from "../../components/Drawer";
import { SelectFilesDrawer } from "../../components/project/SelectFilesDrawer";
import { useProjectContext } from "../../context/project";
import useQueryParams from "../../hooks/useQueryParams";
import { removeQueryParam } from "../../utils/location";
import { ImportedFilesDrawer } from "../../components/ImportedFilesDrawer";

interface PageQueryParams {
  openFileSelection: string | undefined;
}

export const ProjectDatasetsPage = () => {
  const { openFileSelection } = useQueryParams<PageQueryParams>();
  const { selectFilesDrawer, importedFilesDrawer } = useProjectContext();
  const fileSelectorOpenedLock = useRef(false);

  useEffect(() => {
    if (openFileSelection && Number(openFileSelection) === 1) {
      setTimeout(() => {
        if (fileSelectorOpenedLock.current == false) {
          selectFilesDrawer.onOpen();
          removeQueryParam("openFileSelection");
          fileSelectorOpenedLock.current = true;
        }
      }, 150);
    }
  }, [openFileSelection]);

  return (
    <Box marginTop={"16px"}>
      <ChakraDrawer
        title="Add files to project"
        drawerContentStyles={{ maxWidth: "600px" }}
        {...selectFilesDrawer}
      >
        <SelectFilesDrawer {...selectFilesDrawer} />
      </ChakraDrawer>

      <ChakraDrawer
        title="Imported files"
        drawerContentStyles={{ maxWidth: "600px" }}
        {...importedFilesDrawer}
      >
        <ImportedFilesDrawer {...importedFilesDrawer} />
      </ChakraDrawer>
    </Box>
  );
};
