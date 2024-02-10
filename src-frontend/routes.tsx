import { Route, Routes } from "react-router-dom";
import { IndexPage } from "./pages";
import { ProjectIndexPage } from "./pages/project";
import { ROUTES } from "./utils/constants";
import { ProjectProvider } from "./context/project";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />

      <Route
        path={ROUTES.project}
        element={
          <ProjectProvider>
            <ProjectIndexPage />
          </ProjectProvider>
        }
      />
    </Routes>
  );
};
