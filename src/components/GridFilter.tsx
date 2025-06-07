import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import React from "react";

interface GridFilterProps {
  viewType: string;
  setViewType: (value: string) => void;
  items: { label: string; value: string; icon: React.ReactNode }[];
}

const GridFilter = ({ viewType, setViewType, items }: GridFilterProps) => {
  return (
    <div className="md:flex items-center gap-2 bg-[#f6f6f6] p-1 rounded-lg hidden">
      {items.map((item) => (
        <Button
          key={item.value}
          size={"icon"}
          variant={"outline"}
          className={cn(
            "bg-transparent border-none",
            viewType === item.value && "bg-white shadow hover:bg-white"
          )}
          onClick={() => setViewType(item.value)}
        >
          {item.icon}
        </Button>
      ))}
    </div>
  );
};

export default GridFilter;
