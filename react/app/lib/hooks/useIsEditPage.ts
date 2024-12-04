import { removeTrailingSlash } from "@/lib/utils/helpers";
import { useMemo } from "react";
import { useLocation } from "react-router";

export default function useIsEditPage() {
  const { pathname } = useLocation();

  const isEdit = useMemo(
    () => removeTrailingSlash(pathname).endsWith("update"),
    [pathname]
  );

  return { isEdit };
}
