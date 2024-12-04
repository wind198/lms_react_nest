import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/index.tsx", [
    layout("routes/auth/layout.tsx", [
      route("/auth/login", "routes/auth/login/index.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
