import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/css/styles.css";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { customChakraTheme } from "./theme";
import { Layout } from "./layout/layout";
import { LogProvider } from "./context/log";
import { AppProvider } from "./context/app";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <ChakraProvider theme={customChakraTheme}>
          <LogProvider>
            <App />
          </LogProvider>
        </ChakraProvider>
      </AppProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
