import usePageMetaStore from "@/lib/store/usePageMetaStore";
import { Breadcrumb } from "antd";

export default function AppBreadcrumbs() {
  const { breadcrumbs } = usePageMetaStore();

  return <Breadcrumb items={breadcrumbs}></Breadcrumb>;
}
