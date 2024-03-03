import Login from "../pages/Login";
import Register from "../pages/Register";

export const guestRoutes = [
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
];
