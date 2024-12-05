import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { create } from "zustand";
type IPageMetaStore = {
  pageTitle?: string;
  breadcrumbs?: ItemType[];
  setPageTitle: (v: string) => void;
  setBreadcrumbs: (v: ItemType[]) => void;
};

const usePageMetaStore = create<IPageMetaStore>((set) => {
  return {
    setPageTitle(v) {
      set({ pageTitle: v });
    },
    setBreadcrumbs(v: ItemType[]) {
      set({ breadcrumbs: v });
    },
    breadcrumbs: [],
    pageTitle: "",
  };
});

export default usePageMetaStore;
