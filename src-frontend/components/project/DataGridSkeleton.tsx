import { AgGridReact } from "ag-grid-react";
import { useLayoutContext } from "../../context/layout";

export const DataGridSkeleton = () => {
  const { titleBarHeight, menuBarHeight, bottomMenuHeight } =
    useLayoutContext();
  return (
    <div
      className="ag-theme-alpine-dark"
      style={{
        width: "100%",
        height: `calc(100vh - ${titleBarHeight}px - ${menuBarHeight}px - ${bottomMenuHeight}px - 32px)`,
      }}
    >
      <AgGridReact
        pagination={true}
        rowModelType={"infinite"}
        paginationAutoPageSize={true}
        cacheBlockSize={100}
        overlayLoadingTemplate={
          '<span class="ag-overlay-loading-center">No file selected...</span>'
        }
      />
    </div>
  );
};
