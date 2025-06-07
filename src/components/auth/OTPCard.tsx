/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import useAuthStore from "@/store/auth-store";
import { REGEXP_ONLY_DIGITS } from "input-otp";

interface SignUpCardProps {
  form?: any;
  onSubmit?: any;
  resendOTP?: any;
}
const OTPCard = ({ form, onSubmit, resendOTP }: SignUpCardProps) => {
  const { setIsReceivingOTP } = useAuthStore();
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pt-8 pb-2">
        <CardTitle className="text-center text-2xl font-semibold text-gray-800">
          Verify it's you
        </CardTitle>
        <CardDescription>
          We just sent a six digit code to your email address. Enter the code
          below to verify your account.
        </CardDescription>
      </CardHeader>
      <CardContent className=" pt-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 items-center justify-center"
          >
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      {...field}
                      pattern={REGEXP_ONLY_DIGITS}
                    >
                      <InputOTPGroup className="flex items-center justify-center w-full">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Continue
            </Button>
            <p className="text-sm text-slate-700">
              Didn't receive the code?{" "}
              <span
                className="text-black underline cursor-pointer"
                onClick={resendOTP}
              >
                Resend
              </span>
            </p>
            <Button
              type="submit"
              className="w-full"
              variant={"outline"}
              onClick={() => setIsReceivingOTP(false)}
            >
              Go Back
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default OTPCard;
