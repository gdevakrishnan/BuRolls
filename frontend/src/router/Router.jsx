import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "../pages/common/RootLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/common/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}