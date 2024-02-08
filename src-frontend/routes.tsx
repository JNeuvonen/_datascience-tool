import { Route, Routes } from "react-router-dom";
import { IndexPage } from "./pages";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
    </Routes>
  );
};
