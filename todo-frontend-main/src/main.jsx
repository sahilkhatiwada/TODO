import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import "./index.css";
import { guestRoutes } from "./routes/guestRoutes";
import { mainRoutes } from "./routes/mainRoutes";
import { QueryClient, QueryClientProvider } from "react-query";

const router = createBrowserRouter([...mainRoutes, ...guestRoutes]);
// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
