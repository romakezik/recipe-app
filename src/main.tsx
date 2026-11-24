import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const container = document.getElementById("root");

if (!container) {
  throw new Error("Не найден корневой элемент #root — проверьте index.html");
}

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
