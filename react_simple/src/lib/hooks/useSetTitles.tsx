import useApiHttpClient from "@/lib/hooks/useHttpClient";
import usePageMetaStore, {
  IBreadcrumbsItemType,
} from "@/lib/store/usePageMetaStore";
import useResourceReprentationStore from "@/lib/store/useResourceReprentationStore";
import { getRepresentationUrl } from "@/lib/utils/helpers";
import { allRoutes } from "@/routes/allRoutes";
import { first, get, last } from "lodash-es";
import { startTransition, useCallback, useEffect, useTransition } from "react";
import { useLocation, matchRoutes, useParams } from "react-router";
import { useStore } from "zustand";

const DefaultLinks: IBreadcrumbsItemType[] = [
  {
    label: "Home",
    to: "/",
    key: "root",
  },
];

export default function useSetupTitleAndBreadcrumbs() {
  const { pathname } = useLocation();

  const { setPageTitle, setBreadcrumbs } = usePageMetaStore();

  const representationDic = useResourceReprentationStore((i) => i.data);

  const { update } = useResourceReprentationStore();

  const params = useParams();

  const paramsStr = JSON.stringify(params);

  const { $get } = useApiHttpClient();

  const setupBreadcrumbsOnPathnameChange = useCallback(
    async (representationDic: Record<string, Record<string, string>> = {}) => {
      const matches = matchRoutes(allRoutes, { pathname });
      const match = last(matches?.filter((i) => i.route.meta?.title));
      const title = match?.route?.meta?.title ?? "";
      if (title) {
        document.title = title;
        setPageTitle(title);
      }

      const links: IBreadcrumbsItemType[] = [];
      matches?.forEach(({ pathname, route: { id, meta = {} } }) => {
        const { breadcrumbLabel } = meta;
        if (breadcrumbLabel) {
          links.push({
            label: breadcrumbLabel,
            key: id ?? pathname,
            to: pathname,
          });
        }
      });
      if (links.length > 0 && first(links)?.key !== "root") {
        links.unshift(...DefaultLinks);
      }
      setBreadcrumbs(links);

      startTransition(() => {
        Promise.all(
          links.map(async (l) => {
            const { label, to } = l;

            if (!label.startsWith(":")) {
              return l;
            }
            const idValue = params[label.slice(1)];
            if (!idValue) {
              return l;
            }

            const toSegments = to.split("/");
            const resourcePlural = toSegments[toSegments.length - 2];
            if (!resourcePlural) {
              return l;
            }
            const value = get(representationDic, [resourcePlural, idValue]);
            if (value) {
              return { ...l, label: value };
            }
            const { data } = await $get(
              getRepresentationUrl(resourcePlural, idValue)
            );
            update([resourcePlural, idValue], data);
            return { ...l, label: data };
          })
        ).then((linkWithRepresentation) =>
          setBreadcrumbs(linkWithRepresentation)
        );
      });
    },
    [$get, params, pathname, setBreadcrumbs, setPageTitle, update]
  );

  useEffect(() => {
    setupBreadcrumbsOnPathnameChange(representationDic);
  }, [pathname, paramsStr]);
}
