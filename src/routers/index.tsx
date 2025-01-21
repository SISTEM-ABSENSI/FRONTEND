import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/error-page";
import LoginView from "../pages/auth/LoginView";
import AuthLayout from "../layouts/AuthLayout";
import { useToken } from "../hooks/token";
import MobileLayout from "../layouts/MobileLayout";
import HomeView from "../pages/home/HomeView";
import ProfileView from "../pages/profile/ProfileView";
import ListAttendanceView from "../pages/attendance/ListAttendanceView";
import ListScheduleView from "../pages/schedule/ListScheduleView";
import CreateScheduleView from "../pages/schedule/CreateScheduleView";
import EditScheduleView from "../pages/schedule/EditScheduleView";
import DetailAttendanceView from "../pages/attendance/DetailAttendanceView";
import HistoryAttendanceView from "../pages/attendance/HistoryAttendanceView";
import EditProfileView from "../pages/profile/EditProfileView";
import RegisterView from "../pages/auth/RegisterView";

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
      path: "/profiles/edit",
      element: <EditProfileView />,
    },
    {
      path: "/attendances",
      element: <ListAttendanceView />,
    },
    {
      path: "/attendances/detail/:id",
      element: <DetailAttendanceView />,
    },
    {
      path: "/attendances/histories",
      element: <HistoryAttendanceView />,
    },
    {
      path: "/schedules",
      element: <ListScheduleView />,
    },
    {
      path: "/schedules/create",
      element: <CreateScheduleView />,
    },
    {
      path: "/schedules/edit/:id",
      element: <EditScheduleView />,
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
  {
    path: "/register",
    element: <RegisterView />,
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
