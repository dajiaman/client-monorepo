import { RouterProvider, createHashRouter } from "react-router-dom";
import HomePage from "./pages/home/home";
import Setting from "./pages/setting/setting";
import Login from "./pages/login/login";
import SupportPlatformPage from "./pages/supportPlatform/supportPlatform";
import Platform from "./pages/platform/platform";
import DefaultLayout from "./layouts";

const router = createHashRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "/setting",
        element: <Setting />,
      },
      {
        path: "/platform",
        element: <Platform />,
      },
      {
        path: "/supportPlatform",
        element: <SupportPlatformPage />,
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
]);

const RoutePage = () => {
  return <RouterProvider router={router} />;
};

export default RoutePage;
