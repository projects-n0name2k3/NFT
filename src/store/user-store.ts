// src/stores/userStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  walletAddress: string;
  name: string;
  thumbnailUrl: string;
  coverPhotoUrl: string;
  role: string;
  organizerId?: string;
  email?: string;
  phoneNumber?: string | null;
  bio?: string | null;
  facebookLink?: string | null;
  telegramLink?: string | null;
  instagramLink?: string | null;
  xLink?: string | null;
  discordLink?: string | null;
  websiteLink?: string | null;
}

interface UserState {
  user: User | null;
  setUser: (userData: User) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (userData: User) => set({ user: userData }),
      updateUser: (updates: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage",
    }
  )
);

export default useUserStore;
