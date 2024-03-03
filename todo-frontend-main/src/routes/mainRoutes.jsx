import AddTodo from "../pages/AddTodo";
import EditTodo from "../pages/EditTodo";
import Home from "../pages/Home";

export const mainRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/add-todo",
    element: <AddTodo />,
  },
  {
    path: "/edit-todo/:id",
    element: <EditTodo />,
  },
];
