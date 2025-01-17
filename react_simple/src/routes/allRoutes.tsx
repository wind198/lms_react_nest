import Home from "@/routes";
import { IndexRouteObject, Navigate, NonIndexRouteObject } from "react-router";
import AuthLayout from "./auth/layout";
import Login from "./auth/login";
import HomeLayout from "./layout";
import HumanManagementLayout from "@/routes/human-managements/layout";
import CreateStudent from "@/routes/human-managements/students/create";
import Students from "@/routes/human-managements/students";
import ListStudents from "@/routes/human-managements/students/index";
import Teachers from "@/routes/human-managements/teachers";
import CreateTeacher from "@/routes/human-managements/teachers/create";
import Admins from "@/routes/human-managements/admins";
import ListAdmins from "@/routes/human-managements/admin";
import ListTeachers from "@/routes/human-managements/teachers/index";
import CreateAdmin from "@/routes/human-managements/admin/create";
import StudentDetail from "@/routes/human-managements/students/[id]";
import ShowStudent from "@/routes/human-managements/students/[id]/index";
import TeacherDetail from "@/routes/human-managements/teachers/[id]";
import ShowTeacher from "@/routes/human-managements/teachers/[id]/index";
import AdminDetail from "@/routes/human-managements/admin/[id]";
import ShowAdmin from "@/routes/human-managements/admin/[id]/index";
import Majors from "@/routes/majors";
import ListMajors from "@/routes/study/majors/index";
import CreateMajor from "@/routes/study/majors/create";
import MajorDetail from "@/routes/study/majors/[id]";
import ShowMajor from "@/routes/study/majors/[id]/index";
import Courses from "@/routes/courses";
import ListCourses from "@/routes/study/courses/index";
import CourseDetail from "@/routes/study/courses/[id]";
import ShowCourse from "@/routes/study/courses/[id]/index";
import Rooms from "@/routes/study/rooms";
import ListRooms from "@/routes/study/rooms/index";
import CreateRoom from "@/routes/study/rooms/create";
import RoomDetail from "@/routes/study/rooms/[id]";
import ShowRoom from "@/routes/study/rooms/[id]/index";
import RoomSettings from "@/routes/study/room-settings";
import ListRoomSettings from "@/routes/study/rooms-settings/index";
import CreateRoomSetting from "@/routes/study/rooms-settings/create";
import RoomSettingDetail from "@/routes/study/rooms-settings/[id]";
import ShowRoomSetting from "@/routes/study/rooms-settings/[id]/index";
import CreateCourse from "@/routes/study/courses/create";

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
            element: <Students />,
            meta: {
              title: "Students",
              breadcrumbLabel: "Students",
            },
            children: [
              {
                element: <ListStudents />,
                index: true,
              },
              {
                path: "create",
                element: <CreateStudent />,
                meta: {
                  title: "Create students",
                  breadcrumbLabel: "Create",
                },
              },
              {
                path: ":id",
                element: <StudentDetail />,
                meta: {
                  title: "Students detail",
                  breadcrumbLabel: ":id",
                },
                children: [
                  {
                    element: <ShowStudent />,
                    index: true,
                  },
                  {
                    element: <CreateStudent />,
                    path: "edit",
                    meta: {
                      title: "Edit student",
                      breadcrumbLabel: "Edit",
                    },
                  },
                ] as CustomRouteObject[],
              },
            ] as CustomRouteObject[],
          },
          {
            path: "/human-management/teachers",
            element: <Teachers />,
            meta: {
              title: "Teachers",
              breadcrumbLabel: "Teachers",
            },
            children: [
              {
                element: <ListTeachers />,
                index: true,
              },
              {
                path: "create",
                element: <CreateTeacher />,
                meta: {
                  title: "Create teachers",
                  breadcrumbLabel: "Create",
                },
              },
              {
                path: ":id",
                element: <TeacherDetail />,
                meta: {
                  title: "Teacher details",
                  breadcrumbLabel: ":id",
                },
                children: [
                  {
                    element: <ShowTeacher />,
                    index: true,
                  },
                  {
                    element: <CreateTeacher />,
                    path: "edit",
                    meta: {
                      title: "Edit teacher",
                      breadcrumbLabel: "Edit",
                    },
                  },
                ] as CustomRouteObject[],
              },
            ] as CustomRouteObject[],
          },
          {
            path: "/human-management/admins",
            element: <Admins />,
            meta: {
              title: "Admins",
              breadcrumbLabel: "Admins",
            },
            children: [
              {
                element: <ListAdmins />,
                index: true,
              },
              {
                path: "create",
                element: <CreateAdmin />,
                meta: {
                  title: "Create admins",
                  breadcrumbLabel: "Create",
                },
              },
              {
                path: ":id",
                element: <AdminDetail />,
                meta: {
                  title: "Admin details",
                  breadcrumbLabel: ":id",
                },
                children: [
                  {
                    element: <ShowAdmin />,
                    index: true,
                  },
                  {
                    element: <CreateAdmin />,
                    path: "edit",
                    meta: {
                      title: "Edit admin",
                      breadcrumbLabel: "Edit",
                    },
                  },
                ] as CustomRouteObject[],
              },
            ] as CustomRouteObject[],
          },
        ] as CustomRouteObject[],
      },
      {
        element: <HumanManagementLayout />,
        children: [
          {
            path: "/study/majors",
            element: <Majors />,
            meta: {
              title: "Majors",
              breadcrumbLabel: "Majors",
            },
            children: [
              {
                element: <ListMajors />,
                index: true,
              },
              {
                path: "create",
                element: <CreateMajor />,
                meta: {
                  title: "Create majors",
                  breadcrumbLabel: "Create",
                },
              },
              {
                path: ":id",
                element: <MajorDetail />,
                meta: {
                  title: "Majors detail",
                  breadcrumbLabel: ":id",
                },
                children: [
                  {
                    element: <ShowMajor />,
                    index: true,
                  },
                  {
                    element: <CreateMajor />,
                    path: "edit",
                    meta: {
                      title: "Edit major",
                      breadcrumbLabel: "Edit",
                    },
                  },
                ] as CustomRouteObject[],
              },
            ] as CustomRouteObject[],
          },
          {
            path: "/study/courses",
            element: <Courses />,
            meta: {
              title: "Courses",
              breadcrumbLabel: "Courses",
            },
            children: [
              {
                element: <ListCourses />,
                index: true,
              },
              {
                path: "create",
                element: <CreateCourse />,
                meta: {
                  title: "Create courses",
                  breadcrumbLabel: "Create",
                },
              },
              {
                path: ":id",
                element: <CourseDetail />,
                meta: {
                  title: "Course details",
                  breadcrumbLabel: ":id",
                },
                children: [
                  {
                    element: <ShowCourse />,
                    index: true,
                  },
                  {
                    element: <CreateCourse />,
                    path: "edit",
                    meta: {
                      title: "Edit course",
                      breadcrumbLabel: "Edit",
                    },
                  },
                ] as CustomRouteObject[],
              },
            ] as CustomRouteObject[],
          },
          {
            path: "/study/rooms",
            element: <Rooms />,
            meta: {
              title: "Rooms",
              breadcrumbLabel: "Rooms",
            },
            children: [
              {
                element: <ListRooms />,
                index: true,
              },
              {
                path: "create",
                element: <CreateRoom />,
                meta: {
                  title: "Create rooms",
                  breadcrumbLabel: "Create",
                },
              },
              {
                path: ":id",
                element: <RoomDetail />,
                meta: {
                  title: "Room details",
                  breadcrumbLabel: ":id",
                },
                children: [
                  {
                    element: <ShowRoom />,
                    index: true,
                  },
                  {
                    element: <CreateRoom />,
                    path: "edit",
                    meta: {
                      title: "Edit room",
                      breadcrumbLabel: "Edit",
                    },
                  },
                ] as CustomRouteObject[],
              },
            ] as CustomRouteObject[],
          },
          {
            path: "/study/room-settings",
            element: <RoomSettings />,
            meta: {
              title: "Room settings",
              breadcrumbLabel: "Room settings",
            },
            children: [
              {
                element: <ListRoomSettings />,
                index: true,
              },
              {
                path: "create",
                element: <CreateRoomSetting />,
                meta: {
                  title: "Create room-settings",
                  breadcrumbLabel: "Create",
                },
              },
              {
                path: ":id",
                element: <RoomSettingDetail />,
                meta: {
                  title: "Room setting details",
                  breadcrumbLabel: ":id",
                },
                children: [
                  {
                    element: <ShowRoomSetting />,
                    index: true,
                  },
                  {
                    element: <CreateRoomSetting />,
                    path: "edit",
                    meta: {
                      title: "Edit room setting",
                      breadcrumbLabel: "Edit",
                    },
                  },
                ] as CustomRouteObject[],
              },
            ] as CustomRouteObject[],
          },
        ] as CustomRouteObject[],
      },
    ] as CustomRouteObject[],
  },
];
// {
//   path: "/human-management/teachers",
//   element: <ListTeachers />,
//   meta: {
//     title: "List teachers",
//     breadcrumbLabel: "Teachers",
//   },
// },
// {
//   path: "/human-management/admins",
//   element: <ListAdmins />,
//   meta: {
//     title: "List admins",
//     breadcrumbLabel: "Admins",
//   },
// },
