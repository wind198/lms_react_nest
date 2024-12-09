import { create } from "zustand";
export type IBreadcrumbsItemType = {
  key: string;
  label: string;
  to: string;
};

type IPageMetaStore = {
  pageTitle?: string;
  breadcrumbs?: IBreadcrumbsItemType[];
  setPageTitle: (v: string) => void;
  setBreadcrumbs: (v: IBreadcrumbsItemType[]) => void;
};

const usePageMetaStore = create<IPageMetaStore>((set) => {
  return {
    setPageTitle: (v) => {
      set({ pageTitle: v });
    },
    setBreadcrumbs: (v: IBreadcrumbsItemType[]) => {
      set({ breadcrumbs: v });
    },
    breadcrumbs: [],
    pageTitle: "",
  };
});

export default usePageMetaStore;
