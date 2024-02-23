import { Box } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { ChakraDrawer } from "../../components/Drawer";
import { ImportedFilesDrawer } from "../../components/ImportedFilesDrawer";
import { BottomMenu } from "../../components/project/BottomMenu";
import { DatasetDataGrid } from "../../components/project/DataGrid";
import { DataGridSkeleton } from "../../components/project/DataGridSkeleton";
import { SelectFilesDrawer } from "../../components/project/SelectFilesDrawer";
import { useProjectContext } from "../../context/project";
import { usePathParams } from "../../hooks/usePathParams";
import useQueryParams from "../../hooks/useQueryParams";
import { getAgGridFilterType } from "../../utils/dataset";
import { removeQueryParam } from "../../utils/location";
import { CellClickedEvent, CellValueChangedEvent } from "ag-grid-community";

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

      {fileColumnsQuery.data ? (
        <DatasetDataGrid
          columnDefs={fileColumnsQuery.data.map((item) => {
            return {
              headerName: item.name,
              field: item.name,
              editable: true,
              filter: getAgGridFilterType(item.type),
              filterParams:
                item.type === "CATEGORY"
                  ? {
                      values: item.categorical_values,
                      type: item.type,
                    }
                  : {},
            };
          })}
          onCellClicked={(e: CellClickedEvent) => {
            console.log(e);
          }}
          handleCellValueChanged={(rowData: CellValueChangedEvent) => {
            console.log(rowData);
          }}
          columnLabels={fileColumnsQuery.data.map((item) => item.name)}
          projectName={project}
        />
      ) : (
        <DataGridSkeleton />
      )}
      <BottomMenu />
    </Box>
  );
};
