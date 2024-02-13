import { AgGridReact } from "ag-grid-react";
import { useLayoutContext } from "../../context/layout";

export const DataGridSkeleton = () => {
  const { titleBarHeight, menuBarHeight } = useLayoutContext();
  return (
    <div
      className="ag-theme-alpine-dark"
      style={{
        width: "100%",
        height: `calc(100vh - ${titleBarHeight}px - ${menuBarHeight}px - 48px)`,
      }}
    >
      <AgGridReact
        pagination={true}
        rowModelType={"infinite"}
        paginationAutoPageSize={true}
        cacheBlockSize={100}
        overlayLoadingTemplate={
          '<span class="ag-overlay-loading-center">No dataset selected...</span>'
        }
      />
    </div>
  );
};
