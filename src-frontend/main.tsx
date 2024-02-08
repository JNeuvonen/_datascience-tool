import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/css/styles.css";
import { ChakraProvider } from "@chakra-ui/react";
import { customChakraTheme } from "./theme";
import { Layout } from "./layout/layout";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={customChakraTheme}>
      <Layout>
        <App />
      </Layout>
    </ChakraProvider>
  </React.StrictMode>,
);
