import {
  CellClickedEvent,
  CellValueChangedEvent,
  ColDef,
  GridApi,
  IGetRowsParams,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import { useEffect, useState } from "react";
import { getProjectPagination } from "../../client/requests";
import { useProjectContext } from "../../context/project";
import { convertColumnsToAgGridFormat } from "../../utils/table";
import { useLayoutContext } from "../../context/layout";

interface Props {
  columnDefs: ColDef[];
  columnLabels: string[];
  onCellClicked: (event: CellClickedEvent) => void;
  handleCellValueChanged: (rowData: CellValueChangedEvent) => void;
  maxRows: number;
  projectName: string;
}

export const DatasetDataGrid = ({
  columnDefs,
  onCellClicked,
  handleCellValueChanged,
  maxRows,
  columnLabels,
  projectName,
}: Props) => {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [stateColumnDefs] = useState(columnDefs);
  const { selectedFile } = useProjectContext();
  const { titleBarHeight, menuBarHeight } = useLayoutContext();

  useEffect(() => {
    if (gridApi && selectedFile) {
      const dataSource = {
        getRows: (params: IGetRowsParams) => {
          const pageSize = params.endRow - params.startRow;
          const page = params.endRow / pageSize;
          getProjectPagination(
            projectName,
            selectedFile?.file_name,
            page,
            pageSize
          )
            .then((res) => {
              params.successCallback(
                convertColumnsToAgGridFormat(res.data, columnLabels),
                maxRows
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
        columnDefs={stateColumnDefs}
        pagination={true}
        onColumnHeaderClicked={onCellClicked}
        onCellValueChanged={handleCellValueChanged}
        rowModelType={"infinite"}
        paginationAutoPageSize={true}
        ensureDomOrder={true}
        suppressColumnVirtualisation={true}
      />
    </div>
  );
};
