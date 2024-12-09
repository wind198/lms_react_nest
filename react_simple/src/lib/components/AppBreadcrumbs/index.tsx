import usePageMetaStore from "@/lib/store/usePageMetaStore";
import { Breadcrumb } from "antd";
import { NavLink } from "react-router";

export default function AppBreadcrumbs() {
  const { breadcrumbs } = usePageMetaStore();

  return (
    <Breadcrumb
      items={breadcrumbs?.map(({ key, label, to }) => ({
        key,
        title: <NavLink to={to}>{label}</NavLink>,
      }))}
    ></Breadcrumb>
  );
}
