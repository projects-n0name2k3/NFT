import { Label } from "@/components/ui/label";

interface RequireLabelProps {
  label: string;
  htmlFor?: string;
}

const RequireLabel = ({ label, htmlFor }: RequireLabelProps) => {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      <span className="text-red-500">*</span>
    </div>
  );
};

export default RequireLabel;
