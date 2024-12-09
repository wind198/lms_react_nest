import { ReactNode } from "react";
import { create } from "zustand";

type ILongTextDialogStore = {
  text: string;
  isShown: boolean;
  title: string;
  open: (payload: { text: string; title: string }) => void;
  close: () => void;
};

const useLongTextDialogStore = create<ILongTextDialogStore>((set) => {
  return {
    close: () => {
      set({ text: "", title: "", isShown: false });
    },
    open: (payload) => {
      set({ text: payload.text, title: payload.title, isShown: true });
    },
    isShown: false,
    text: "",
    title: "",
  };
});

export default useLongTextDialogStore;
