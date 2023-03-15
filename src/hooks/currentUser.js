import { create } from "zustand";

export const useCurrentUserRole = create((set) => ({
  role: "staff",
  setRole: (state) => set({ role: state }),
}));
