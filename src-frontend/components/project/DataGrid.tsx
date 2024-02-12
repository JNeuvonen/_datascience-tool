import {
  CellClickedEvent,
  CellValueChangedEvent,
  ColDef,
  IGetRowsParams,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import { useEffect } from "react";
import { getProjectPagination } from "../../client/requests";
import { useProjectContext } from "../../context/project";
import { convertColumnsToAgGridFormat } from "../../utils/table";
import { useLayoutContext } from "../../context/layout";

interface Props {
  columnDefs: ColDef[];
  columnLabels: string[];
  onCellClicked: (event: CellClickedEvent) => void;
  handleCellValueChanged: (rowData: CellValueChangedEvent) => void;
  projectName: string;
}

export const DatasetDataGrid = ({
  columnDefs,
  onCellClicked,
  handleCellValueChanged,
  columnLabels,
  projectName,
}: Props) => {
  const { selectedFile, gridApi, setGridApi } = useProjectContext();
  const { titleBarHeight, menuBarHeight } = useLayoutContext();

  useEffect(() => {
    if (gridApi && selectedFile) {
      const dataSource = {
        getRows: (params: IGetRowsParams) => {
          const pageSize = params.endRow - params.startRow;
          const page = params.endRow / pageSize;
          const filters = gridApi?.getFilterModel();
          getProjectPagination(
            projectName,
            selectedFile?.file_name,
            page,
            pageSize,
            filters
          )
            .then((res) => {
              params.successCallback(
                convertColumnsToAgGridFormat(res.data, columnLabels),
                res.max_rows
              );
            })
            .catch(() => {});
        },
      };
      gridApi.setGridOption("datasource", dataSource);
    }
  }, [gridApi, selectedFile]);

  return (
    <div
      className="ag-theme-alpine-dark"
      style={{
        width: "100%",
        height: `calc(100vh - ${titleBarHeight}px - ${menuBarHeight}px - 48px)`,
      }}
    >
      <AgGridReact
        onGridReady={(params) => {
          setGridApi(params.api);
        }}
        columnDefs={columnDefs}
        pagination={true}
        onColumnHeaderClicked={onCellClicked}
        onCellValueChanged={handleCellValueChanged}
        rowModelType={"infinite"}
        paginationAutoPageSize={true}
        cacheBlockSize={100}
      />
    </div>
  );
};
