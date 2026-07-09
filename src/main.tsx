// =======================================================
// ===== refactoring "React Query" and pagination ========
// =======================================================
// базова розмітка сторінки через ReactDOM , файл-аналог HTML,
// для REACT - це *.TSX
// -------------------------------------------------------

import ReactDOM from "react-dom/client";
import { StrictMode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import App from "./components/App/App";
// ----------------------------------------------
// Нормалізація стилів
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </StrictMode>
  </QueryClientProvider>,
);

// =======================================================
// =========== before refactoring and pagination =========
// =======================================================
// import App from "./components/App/App";
// import React from "react";
// import ReactDOM from "react-dom/client";

// ----------------------------------------------
// Нормалізація стилів (declarations.d.ts)
// import "modern-normalize";
// import "./index.css";

// ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// );
