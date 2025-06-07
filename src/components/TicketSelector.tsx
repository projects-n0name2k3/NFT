import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";

interface TicketSelectorProps {
  quantity: number;
  setQuantity: (quantity: number) => void;
  maxPerUser: number;
}

export default function TicketSelector({
  quantity,
  setQuantity,
  maxPerUser,
}: TicketSelectorProps) {
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < maxPerUser) {
      // Max per wallet limit
      setQuantity(quantity + 1);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="outline"
        size="icon"
        onClick={decreaseQuantity}
        disabled={quantity <= 1}
      >
        <MinusIcon className="h-4 w-4" />
      </Button>

      <div className="w-8 text-center">{quantity}</div>

      <Button
        variant="outline"
        size="icon"
        onClick={increaseQuantity}
        disabled={quantity >= maxPerUser}
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
