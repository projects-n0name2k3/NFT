/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAccount, useSignMessage } from "wagmi";
import { authService } from "@/services/auth";
import useAuthStore from "@/store/auth-store";
import useUserStore from "@/store/user-store";

const switchToBNBTestnet = async () => {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x61" }], // BNB Testnet
    });
  } catch (switchError: any) {
    // If not added, add it
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x61",
            chainName: "BNB Smart Chain Testnet",
            rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
            nativeCurrency: {
              name: "BNB",
              symbol: "BNB",
              decimals: 18,
            },
            blockExplorerUrls: ["https://testnet.bscscan.com"],
          },
        ],
      });
    }
  }
};

export const useAuth = () => {
  const {
    walletAddress,
    setAuthenticated,
    setMessage,
    setIsReceivingOTP,
    setSignature,
    setError,
  } = useAuthStore();
  const { address } = useAccount();
  const { setUser, clearUser } = useUserStore();
  const { signMessageAsync } = useSignMessage();

  const { reset } = useAuthStore();
  // Query to fetch auth message
  const { refetch: fetchAuthMessage } = useQuery({
    queryKey: ["authMessage", address],
    queryFn: () => authService.getAuthMessage(address!),
    enabled: false,
  });

  // Mutation to verify wallet
  const { mutate: verifyWallet, isPending: isVerifying } = useMutation({
    mutationFn: (params: {
      walletAddress: string;
      message: string;
      signature: string;
    }) =>
      authService.verifyWallet(
        params.walletAddress,
        params.message,
        params.signature
      ),
    onSuccess: (data) => {
      setUser(data.data.user);
      setAuthenticated(true);
    },
  });

  // Mutation to verify wallet
  const { mutate: verifyOrganizerWallet } = useMutation({
    mutationFn: (params: {
      walletAddress: string;
      message: string;
      signature: string;
      email: string;
    }) =>
      authService.verifyOrganizerWallet(
        params.walletAddress,
        params.message,
        params.signature,
        params.email
      ),
    onSuccess: (data) => {
      setUser(data.data.user);
      setAuthenticated(true);
    },
  });

  // Function to initiate the authentication flow
  const authenticate = async (
    walletAddress: string | undefined,
    isOrganizer?: boolean,
    email?: string
  ) => {
    if (!walletAddress) return;
    await switchToBNBTestnet();
    // 1. Fetch auth message
    const messageData = await fetchAuthMessage();
    const authMessage = messageData?.data;

    if (!authMessage) return;

    // 2. Sign the message
    const signature = await signMessageAsync({
      message: authMessage as string,
    });
    setSignature(signature);
    // 3. Verify the signature
    if (isOrganizer && email) {
      verifyOrganizerWallet({
        walletAddress,
        message: authMessage,
        signature,
        email,
      });
    } else {
      verifyWallet({ walletAddress, message: authMessage, signature });
    }
    // await addTokenToMetaMask();
  };

  // Mutation to request OTP
  const { mutate: register, isPending: isRegistering } = useMutation({
    mutationFn: (email: string) => authService.getOTP(walletAddress!, email),
    onSuccess: (response) => {
      setMessage(response.data.message);
      if (response.data.status === 200) {
        setIsReceivingOTP(true);
      }
    },
    onError: (error: any) => {
      setError(error.response.data.message);
    },
  });

  //Mutation to verify OTP
  const { mutate: verifyOTP, isSuccess } = useMutation({
    mutationFn: (params: { code: string; email: string }) =>
      authService.verifyOTP(walletAddress!, params.code, params.email),
    onSuccess: (response) => {
      setMessage(response.data.message);
      if (response.data.status === 200) {
        setIsReceivingOTP(false);
      }
    },
  });

  //mutate for logout
  const { mutate: logout } = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      reset();
      clearUser();

      window.location.href = "/";
    },
  });

  return {
    authenticate,
    register,
    logout,
    verifyOTP,
    isVerifying,
    isSuccess,
    isRegistering,
  };
};
