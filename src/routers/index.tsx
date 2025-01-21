import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/error-page";
import LoginView from "../pages/auth/Login";
import AuthLayout from "../layouts/AuthLayout";
import { useToken } from "../hooks/token";
import MobileLayout from "../layouts/MobileLayout";
import HomeView from "../pages/home/HomeView";
import ProfileView from "../pages/profile/ProfileView";
import AttendanceView from "../pages/attendance/AttendanceView";
import ScheduleView from "../pages/schedule/ScheduleView";

const getProtectedRouters = (role: string) => {
  const mainRouters: { path: string; element: JSX.Element }[] = [];

  const routes = [
    {
      path: "/",
      element: <HomeView />,
    },
    //my profile routers
    {
      path: "/profiles",
      element: <ProfileView />,
    },
    {
      path: "/attendances",
      element: <AttendanceView />,
    },
    {
      path: "/schedules",
      element: <ScheduleView />,
    },
  ];
  console.log(role);
  mainRouters.push(...routes);

  return mainRouters;
};

const authRouters: { path: string; element: JSX.Element }[] = [
  {
    path: "/",
    element: <LoginView />,
  },
  {
    path: "/login",
    element: <LoginView />,
  },
];

export default function AppRouters() {
  const { getDecodeUserToken } = useToken();
  const user = getDecodeUserToken();

  const routers: { path: string; element: JSX.Element }[] = [];

  if (user) {
    const protectedRouters = getProtectedRouters(
      user.userRole?.toLocaleUpperCase()
    );
    routers.push(...protectedRouters);
  } else {
    routers.push(...authRouters);
  }

  const appRouters = createBrowserRouter([
    {
      path: "/",
      element: user ? <MobileLayout /> : <AuthLayout />,
      errorElement: <ErrorPage />,
      children: routers,
    },
  ]);

  return <RouterProvider router={appRouters} />;
}
