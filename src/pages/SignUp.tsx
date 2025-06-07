import { useEffect, useState } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import useAuthStore from "@/store/auth-store";
import SignUpCard from "@/components/auth/SignUpCard";
import OTPCard from "@/components/auth/OTPCard";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  wallet: z.string().nonempty({
    message: "Please connect your wallet",
  }),
});

const otpSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

const SignUp = () => {
  const { address } = useAccount();
  const [walletAddress, setWalletAddress] = useState(address || "");
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const { register, verifyOTP, isSuccess, authenticate } = useAuth();
  const { message, setMessage, isReceivingOTP, error, setError } =
    useAuthStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      wallet: "",
    },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      pin: "",
    },
  });

  useEffect(() => {
    if (address) {
      setWalletAddress(address);
      // Update the form value as well
      form.setValue("wallet", address);
    } else {
      setWalletAddress("");
      form.setValue("wallet", "");
      if (openConnectModal) openConnectModal();
    }
  }, [address, form, openConnectModal]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      setMessage("");
    }
  }, [message, setMessage]);

  useEffect(() => {
    if (isSuccess) {
      authenticate(walletAddress, true, form.getValues("email"));
    }
  }, [isSuccess]);

  function onRegisterSubmit(values: z.infer<typeof formSchema>) {
    setError("");
    register(values.email);
  }

  function onOTPSubmit(values: z.infer<typeof otpSchema>) {
    verifyOTP({ code: values.pin, email: form.getValues("email") });
  }

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="flex justify-center items-center md:min-h-[calc(100vh-330px)] ">
      {isReceivingOTP ? (
        <OTPCard
          form={otpForm}
          onSubmit={onOTPSubmit}
          resendOTP={() => register(form.getValues("email"))}
        />
      ) : (
        <SignUpCard
          address={address}
          walletAddress={walletAddress}
          openConnectModal={openConnectModal}
          disconnect={disconnect}
          form={form}
          onSubmit={onRegisterSubmit}
        />
      )}
    </div>
  );
};

export default SignUp;
