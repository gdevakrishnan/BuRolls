import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "../pages/common/RootLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/common/Home";
import ProtectedRoute from "../components/common/ProtectedRoute";
import PublicRoute from "../components/common/PublicRoute";
import SuperAdminDashboard from "../pages/superadmin/SuperAdminDashboard";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import NotAuthorized from "../pages/common/NotAuthorized";
import BusinessUnitsPage from "../pages/superadmin/BusinessUnitsPage";
import ManagersPage from "../pages/superadmin/ManagersPage";
import Profile from "../pages/common/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },

      // Public routes (only for unauthenticated users)
      {
        element: <PublicRoute />,
        children: [
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
        ],
      },

      // Authenticated routes
      {
        element: <ProtectedRoute />,
        children: [
          { path: "profile", element: <Profile /> },
          { path: "not-authorized", element: <NotAuthorized /> },
        ],
      },

      // Super Admin routes
      {
        path: "admin",
        element: <ProtectedRoute roles={["SUPER_ADMIN"]} />,
        children: [
          { path: "dashboard", element: <SuperAdminDashboard /> },
          { path: "business-units", element: <BusinessUnitsPage /> },
          { path: "managers", element: <ManagersPage /> },
        ],
      },

      // Manager routes
      {
        path: "manager",
        element: <ProtectedRoute roles={["BU_MANAGER"]} />,
        children: [
          { path: "dashboard", element: <ManagerDashboard /> },
        ],
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}