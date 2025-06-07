import { Button } from "@/components/ui/button";

interface ApplyButtonProps {
  label: string;
  secondaryLabel?: string;
  onSubmit?: () => void;
  onClear?: () => void;
}

const ApplyButton = ({
  label,
  secondaryLabel,
  onSubmit,
  onClear,
}: ApplyButtonProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Button className="w-full" onClick={onSubmit}>
        {label}
      </Button>
      {secondaryLabel && (
        <Button className="w-full" variant={"outline"} onClick={onClear}>
          {secondaryLabel}
        </Button>
      )}
    </div>
  );
};

export default ApplyButton;
