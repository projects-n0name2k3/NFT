/* eslint-disable @typescript-eslint/no-explicit-any */
import RequireLabel from "@/components/RequireLabel";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

interface InputFieldProps {
  field: string;
  label: string;
  placeholder?: string;
  handleInputChange: any;
}

const InputField = ({
  field,
  label,
  handleInputChange,
  placeholder,
}: InputFieldProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext(); // Access form context
  return (
    <Card className="p-3 space-y-3 shadow">
      <RequireLabel label={label} htmlFor={field} />
      <Input
        id={field}
        className="w-full"
        placeholder={placeholder}
        {...register(field, { required: true })}
        onChange={handleInputChange}
      />
      {errors[field] && (
        <span className="text-red-500 text-sm">
          {errors[field].message?.toString()}
        </span>
      )}
    </Card>
  );
};
export default InputField;
