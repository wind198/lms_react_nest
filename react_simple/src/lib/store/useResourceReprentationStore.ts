import { cloneDeep, set as lodashSet } from "lodash-es";
import { create } from "zustand";
type IResourceReprentationStore = {
  data: Record<string, Record<string, string>>;
  update(paths: string[], v: string): void;
};

const useResourceReprentationStore = create<IResourceReprentationStore>(
  (set) => {
    return {
      data: {},
      update: (paths: string[], v: string) => {
        set((s) => {
          const newData = cloneDeep(s.data);
          lodashSet(newData, paths, v);
          return { ...s, data: newData };
        });
      },
    };
  }
);

export default useResourceReprentationStore;
