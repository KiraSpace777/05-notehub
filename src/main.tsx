// =======================================================
// базова розмітка сторінки через ReactDOM , файл-аналог HTML,
// для REACT - це *.TSX
// -------------------------------------------------------
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./components/App/App";
import "modern-normalize";
import "./index.css";

// Створюємо екземпляр клієнта React Query з базовими налаштуваннями
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // Вимикаємо повторні запити при зміні вкладок браузера
      retry: 1,
      // Кількість спроб повторної відправки запиту у разі збою мережі
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
