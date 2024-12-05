import Home from "@/routes";
import { IndexRouteObject, Navigate, NonIndexRouteObject } from "react-router";
import AuthLayout from "./auth/layout";
import Login from "./auth/login";
import ListStudents from "./human-managements/students";
import HomeLayout from "./layout";
import HumanManagementLayout from "@/routes/human-managements/layout";

interface CustomIndexRouteObject extends IndexRouteObject {
  meta?: {
    requiresAuth?: boolean;
    title?: string;
    breadcrumbLabel?: string;
    [key: string]: any; // Allow additional meta fields if needed
  };
}

interface CustomNonIndexRouteObject extends NonIndexRouteObject {
  meta?: {
    requiresAuth?: boolean;
    title: string;
    pageTitle?: string;
    [key: string]: any;
  };
}

type CustomRouteObject = CustomIndexRouteObject | CustomNonIndexRouteObject;

export const allRoutes: CustomRouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
        meta: {
          title: "Login to LMS",
          breadcrumbLabel: "Login",
        },
      },
    ] as CustomIndexRouteObject[],
  },
  {
    element: <HomeLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
        meta: {
          title: "LMS system",
          breadcrumbLabel: "Home",
        },
      },
      {
        path: "/human-management",
        element: <Navigate to={"students"} />,
      },
      {
        element: <HumanManagementLayout />,
        children: [
          {
            path: "/human-management/students",
            element: <ListStudents />,
            meta: {
              title: "List students",
              breadcrumbLabel: "Students",
            },
          },
        ] as CustomIndexRouteObject[],
      },
    ] as CustomIndexRouteObject[],
  },
];
