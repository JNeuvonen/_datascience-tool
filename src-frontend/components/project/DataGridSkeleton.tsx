import { AgGridReact } from "ag-grid-react";
import { useLayoutContext } from "../../context/layout";
import { Box, Heading } from "@chakra-ui/layout";
import ReactDOMServer from "react-dom/server";
import { FaDatabase } from "react-icons/fa";
import { useProjectContext } from "../../context/project";
import { useEffect } from "react";

const AG_OVERLAY_ID = "ag-overlay-id";

const InjectedJsx = () => {
  const getInstructionText = () => {
    return "Select a file";
  };

  return (
    <Box className="ag-overlay-loading-center" id={AG_OVERLAY_ID}>
      <FaDatabase />
      <Box>
        <Heading size={"md"}>{getInstructionText()}</Heading>
      </Box>
    </Box>
  );
};

export const DataGridSkeleton = () => {
  const { titleBarHeight, menuBarHeight, bottomMenuHeight } =
    useLayoutContext();
  const projectContext = useProjectContext();

  useEffect(() => {
    // this is a hack because ag-grid doesnt accept JSX elementsso
    // so we are passing stringified JSX element instead.
    // Also the stringified JSX element doesnt accept onClick functions so we are listening for clicks on the parent component
    //
    // Relevant line that started this is below
    // overlayLoadingTemplate={ReactDOMServer.renderToString(
    //     <InjectedJsx/>
    // )}
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes) {
          const overlayElement = document.getElementById(AG_OVERLAY_ID);
          if (overlayElement) {
            const handleClick = () => {
              if (
                !projectContext.projectQuery.data ||
                projectContext.projectQuery.data?.datafiles.length === 0
              ) {
                projectContext.selectFilesDrawer.onOpen();
              } else {
                projectContext.importedFilesDrawer.onOpen();
              }
            };
            overlayElement.addEventListener("click", handleClick);
            observer.disconnect();
            return;
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className="ag-theme-alpine-dark"
      style={{
        width: "100%",
        height: `calc(100vh - ${titleBarHeight}px - ${menuBarHeight}px - ${bottomMenuHeight}px - 42px)`,
      }}
    >
      <AgGridReact
        pagination={true}
        rowModelType={"infinite"}
        paginationAutoPageSize={true}
        cacheBlockSize={100}
        overlayLoadingTemplate={ReactDOMServer.renderToString(<InjectedJsx />)}
      />
    </div>
  );
};
