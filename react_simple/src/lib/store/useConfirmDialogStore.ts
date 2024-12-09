import { ReactNode } from "react";
import { create } from "zustand";

type IConfirmDialogStore = {
  onConfirm: () => void;
  title: string;
  message: ReactNode;
  isShown: boolean;
  open(payload: {
    title: string;
    message: ReactNode;
    onConfirm: () => void;
  }): void;
  close: () => void;
};

const useConfirmDialogStore = create<IConfirmDialogStore>((set) => {
  return {
    onConfirm: () => {},
    isShown: false,
    title: "",
    message: "",
    open: (payload) => {
      set({
        isShown: true,
        title: payload.title,
        message: payload.message,
        onConfirm: payload.onConfirm,
      });
    },
    close: () => {
      set({ isShown: false, title: "", message: "" });
    },
  };
});

export default useConfirmDialogStore;
