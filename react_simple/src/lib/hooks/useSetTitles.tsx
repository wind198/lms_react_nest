import usePageMetaStore from "@/lib/store/usePageMetaStore";
import { allRoutes } from "@/routes/allRoutes";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { first, last } from "lodash-es";
import { useEffect } from "react";
import { useLocation, matchRoutes, Link } from "react-router";

const DefaultLinks: ItemType[] = [
  {
    title: <Link to="/">Home</Link>,
    key: "root",
  },
];

export default function useSetupTitleAndBreadcrumbs() {
  const { pathname } = useLocation();

  const { setPageTitle, setBreadcrumbs } = usePageMetaStore();

  useEffect(() => {
    const matches = matchRoutes(allRoutes, { pathname });
    const match = last(matches);
    const title = match?.route?.meta?.title ?? "";
    if (title) {
      document.title = title;
      setPageTitle(title);
    }

    const links: ItemType[] = [];
    matches?.forEach(({ pathname, route: { id, meta = {} } }) => {
      const { breadcrumbLabel } = meta;
      if (breadcrumbLabel) {
        links.push({
          title: <Link to={pathname}>{breadcrumbLabel}</Link>,
          key: id,
        });
      }
    });
    if (links.length > 0 && first(links)?.key !== "root") {
      links.unshift(...DefaultLinks);
    }
    setBreadcrumbs(links);
  }, [pathname]);
}
