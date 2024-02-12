import { Box } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { ChakraDrawer } from "../../components/Drawer";
import { SelectFilesDrawer } from "../../components/project/SelectFilesDrawer";
import { useProjectContext } from "../../context/project";
import useQueryParams from "../../hooks/useQueryParams";
import { removeQueryParam } from "../../utils/location";
import { ImportedFilesDrawer } from "../../components/ImportedFilesDrawer";
import { DatasetDataGrid } from "../../components/project/DataGrid";
import { usePathParams } from "../../hooks/usePathParams";
import { getAgGridDtype } from "../../utils/dataset";

interface PageQueryParams {
  openFileSelection: string | undefined;
}

export const ProjectDatasetsPage = () => {
  const { project } = usePathParams<{ project: string }>();
  const { openFileSelection } = useQueryParams<PageQueryParams>();
  const { selectFilesDrawer, importedFilesDrawer, fileColumnsQuery } =
    useProjectContext();
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

      {fileColumnsQuery.data && (
        <DatasetDataGrid
          columnDefs={fileColumnsQuery.data.map((item) => {
            return {
              headerName: item[0],
              field: item[0],
              sortable: true,
              editable: true,
              // filter: getAgGridDtype(item[1]),
              filter: "agSetColumnFilter",
              filterParams: {
                values: ["2017-07-06"],
              },
            };
          })}
          onCellClicked={(e: CellClickedEvent) => {}}
          handleCellValueChanged={(rowData: CellValueChangedEvent) => {}}
          columnLabels={fileColumnsQuery.data.map((item) => item[0])}
          projectName={project}
        />
      )}
    </Box>
  );
};
