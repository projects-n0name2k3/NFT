/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "../lib/axios";

interface VerifyWalletResponse {
  data: any; // Replace 'any' with the actual response type
}

export const authService = {
  getOTP: async (walletAddress: string | null, email: string) => {
    const response = await apiClient.post("/auth/otp/organizer/verification", {
      walletAddress,
      email,
    });
    return response;
  },

  verifyOTP: async (
    walletAddress: string | null,
    code: string,
    email: string
  ) => {
    const response = await apiClient.post(
      "/auth/email/organizer/verification",
      {
        walletAddress,
        email,
        code,
      }
    );
    return response;
  },

  getAuthMessage: async (walletAddress: string): Promise<string> => {
    const response = await apiClient.get(`/auth/message/${walletAddress}`);
    return response.data.data.message;
  },

  verifyWallet: async (
    walletAddress: string,
    message: string,
    signature: string
  ): Promise<VerifyWalletResponse> => {
    const response = await apiClient.post("/auth/wallet/user/verification", {
      walletAddress,
      message,
      signature,
    });
    return response.data;
  },

  verifyOrganizerWallet: async (
    walletAddress: string,
    message: string,
    signature: string,
    email: string
  ): Promise<VerifyWalletResponse> => {
    const response = await apiClient.post(
      "/auth/wallet/organizer/verification",
      {
        walletAddress,
        message,
        signature,
        email,
      }
    );
    return response.data;
  },

  logout: async () => {
    await apiClient.post("/auth/logout");
  },
};
