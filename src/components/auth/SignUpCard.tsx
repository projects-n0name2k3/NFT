/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mail, Wallet } from "lucide-react";

interface SignUpCardProps {
  address: `0x${string}` | undefined;
  walletAddress: string;
  openConnectModal: (() => void) | undefined;
  disconnect: () => void;
  form: any;
  onSubmit: any;
}
const SignUpCard = ({
  address,
  walletAddress,
  openConnectModal,
  disconnect,
  form,
  onSubmit,
}: SignUpCardProps) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pt-8 pb-2">
        <CardTitle className="text-center text-2xl font-semibold text-gray-800">
          Become an organizer
        </CardTitle>
        <CardDescription>
          Create an account to start organizing events and selling tickets.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <Button
          variant="default"
          className="w-full bg-gray-700 hover:bg-gray-800 text-white"
          onClick={() => {
            if (address) {
              disconnect();
              if (openConnectModal) openConnectModal();
            } else {
              if (openConnectModal) openConnectModal();
            }
          }}
        >
          {address ? "Switch Account" : "Connect Wallet"}
        </Button>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="wallet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-600 text-sm">
                    <Wallet className="h-4 w-4 text-gray-500" /> Wallet Address
                  </FormLabel>
                  <FormControl>
                    <Input {...field} value={walletAddress} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-600 text-sm">
                    <Mail className="h-4 w-4 text-gray-500" /> Email address
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="email@address.com" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-gray-700 hover:bg-gray-800 text-white"
            >
              Create Account
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-center text-center text-sm text-gray-500 pb-8">
        <p className="mb-2">
          By creating an account, you are agree to the{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
        <p>
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={openConnectModal}
          >
            Connect here
          </span>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignUpCard;
