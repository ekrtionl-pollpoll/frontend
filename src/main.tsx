import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import queryClient from "./config/queryClient.ts";

document.documentElement.classList.add("dark");



createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools position='bottom' initialIsOpen={false} />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>
);
