import { EventTier } from "@/common/type";
import { Card, CardContent } from "@/components/ui/card";
import { formatMoney } from "@/utils/formatMoney";

interface TierCardProps {
  tier: EventTier;
  maxPerUser: number;
}

const TierCard = ({ tier, maxPerUser }: TierCardProps) => {
  return (
    <Card key={tier.id} className="p-4 shadow-sm">
      <CardContent>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-4">
          <h3 className="text-lg font-bold">{tier.name}</h3>
          <div className="text-primary-foreground bg-primary px-3 py-1 rounded-full text-sm font-medium text-center">
            {formatMoney(tier.price)} USDT
          </div>
        </div>

        <div className="flex items-center gap-4">
          <p className="font-semibold">Description : <span className="text-sm text-muted-foreground font-normal">{tier.description}</span></p>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
          <div className="bg-muted rounded-lg px-3 py-2">
            <div className="text-xs text-muted-foreground">Total Supply</div>
            <div className="font-semibold">{tier.totalSupply}</div>
          </div>
          <div className="bg-muted rounded-lg px-3 py-2">
            <div className="text-xs text-muted-foreground">Sold</div>
            <div className="font-semibold">
              {tier.totalSupply - tier.availableSupply}
            </div>
          </div>
          <div className="bg-muted rounded-lg px-3 py-2">
            <div className="text-xs text-muted-foreground">Max per Wallet</div>
            <div className="font-semibold">{maxPerUser}</div>
          </div>
          <div className="bg-muted rounded-lg px-3 py-2">
            <div className="text-xs text-muted-foreground">Royalty</div>
            <div className="font-semibold">{tier.royaltyPercentage}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TierCard;
