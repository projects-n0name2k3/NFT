import { Input } from "@/components/ui/input";

interface PriceFilterProps {
  setFilterPrice: (value: { min: number; max: number }) => void;
  filterPrice?: { min: number; max: number };
  onSubmit?: (field: string) => void;
  onClear?: () => void;
}

const PriceFilter = ({ setFilterPrice, filterPrice }: PriceFilterProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Min "
          className="focus-visible:ring-transparent text-center"
          type="number"
          min={0}
          value={filterPrice && filterPrice.min !== 0 ? filterPrice.min : ""}
          onChange={(e) =>
            setFilterPrice({
              min: parseInt(e.target.value) || 0,
              max: filterPrice?.max || 0,
            })
          }
        />
        <span className="font-semibold">To </span>
        <Input
          placeholder="Max"
          className="focus-visible:ring-transparent text-center"
          type="number"
          min={0}
          value={filterPrice && filterPrice.max !== 0 ? filterPrice.max : ""}
          onChange={(e) =>
            setFilterPrice({
              min: filterPrice?.min || 0,
              max: parseInt(e.target.value) || 0,
            })
          }
        />
      </div>
    </div>
  );
};

export default PriceFilter;
