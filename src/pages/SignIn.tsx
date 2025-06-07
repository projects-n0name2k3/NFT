import useAuthStore from "@/store/auth-store";
import useUserStore from "@/store/user-store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAccount } from "wagmi";

// Define prop types if needed (optional improvement)
const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { openConnectModal, connectModalOpen } = useConnectModal();
  const { isAuthenticated } = useAuthStore();
  const { address } = useAccount();
  const { user } = useUserStore();
  const [modalClosed, setModalClosed] = useState(false);

  // Combine related navigation effects
  useEffect(() => {
    // Open modal if function exists
    if (openConnectModal && !connectModalOpen) {
      openConnectModal();
    }

    // Track modal closed state
    if (!connectModalOpen) {
      setModalClosed(true);
    }

    // Handle navigation cases
    if (!connectModalOpen && modalClosed && !address) {
      navigate("/");
    } else if (isAuthenticated && !location.search.includes("referrer")) {
      navigate("/");
    } else if (user) {
      const referrer =
        new URLSearchParams(location.search).get("referrer") || "/";
      navigate(referrer);
    }
  }, [
    openConnectModal,
    connectModalOpen,
    address,
    isAuthenticated,
    user,
    modalClosed,
    navigate,
    location.search,
  ]);

  return <div className="container mx-auto md:min-h-[calc(100vh-330px)]"></div>;
};

export default SignIn;
