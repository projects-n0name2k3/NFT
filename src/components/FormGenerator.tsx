/* eslint-disable @typescript-eslint/no-explicit-any */
import RequireLabel from "@/components/RequireLabel";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface FormFieldConfig {
  name: string;
  label: string;
  placeholder: string;
  type: string;
  isRequired?: boolean;
  isDisabled?: boolean;
}

interface FormGeneratorProps {
  control: any;
  fields: FormFieldConfig[];
  isGetting?: boolean;
}

const FormGenerator: React.FC<FormGeneratorProps> = ({
  control,
  fields,
  isGetting,
}) => {
  if (isGetting) {
    return fields.map((field, index) => (
      <div key={`skeleton-${index}`} className="space-y-2">
        <Skeleton className="h-4 w-20" /> {/* Label skeleton */}
        <Skeleton
          className={`h-10 w-full ${field.type === "textarea" ? "h-24" : ""}`}
        />{" "}
        {/* Input/Textarea skeleton */}
      </div>
    ));
  }

  return fields.map((field) => (
    <FormField
      key={field.name}
      control={control}
      name={field.name}
      render={({ field: fieldProps }) => (
        <FormItem>
          {field.isRequired ? (
            <RequireLabel label={field.label} htmlFor={field.name} />
          ) : (
            <FormLabel
              className="flex items-center gap-1 text-gray-600 text-sm"
              htmlFor={field.name}
            >
              {field.label}
            </FormLabel>
          )}
          <FormControl>
            {field.type === "textarea" ? (
              <Textarea
                {...fieldProps}
                placeholder={field.placeholder}
                id={field.name}
                disabled={field.isDisabled}
              />
            ) : (
              <Input
                {...fieldProps}
                placeholder={field.placeholder}
                id={field.name}
                disabled={field.isDisabled}
                type={field.type}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ));
};

export default FormGenerator;
