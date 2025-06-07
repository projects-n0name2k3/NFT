import { ContractRunner } from "ethers";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  signature: string | null | ContractRunner;
  message: string | null;
  walletAddress: string | null;
  isReceivingOTP: boolean;
  error: string | null;

  setWalletAddress: (address: string | null) => void;
  setMessage: (message: string | null) => void;
  setSignature: (signature: string | null) => void;
  setAuthenticated: (status: boolean) => void;
  setIsReceivingOTP: (status: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      signature: null,
      message: null,
      walletAddress: null,
      isReceivingOTP: false,
      error: null,

      setWalletAddress: (address) => set({ walletAddress: address }),
      setMessage: (message) => set({ message }),
      setSignature: (signature) => set({ signature }),
      setAuthenticated: (status) => set({ isAuthenticated: status }),
      setIsReceivingOTP: (status) => set({ isReceivingOTP: status }),
      setError: (error) => set({ error }),
      reset: () =>
        set({
          isAuthenticated: false,
          signature: null,
          message: null,
          walletAddress: null,
          isReceivingOTP: false,
          error: null,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;
