import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import { AppRoutes } from "./routes";
import { Layout } from "./layout/layout";

function App() {
  return (
    <Router>
      <Layout>
        <AppRoutes />
      </Layout>
    </Router>
  );
}

export default App;
