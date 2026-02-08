import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { fetchSettings } from "./features/settings/api";
import { installUpdateIfAvailable } from "./lib/updater";
import "./index.css";

const queryClient = new QueryClient();

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const startAutoUpdate = async (): Promise<void> => {
  try {
    const settings = await fetchSettings();
    if (settings.autoUpdate === false) return;
    await installUpdateIfAvailable();
  } catch {
    return;
  }
};

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);

void startAutoUpdate();
