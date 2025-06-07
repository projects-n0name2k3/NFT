/* eslint-disable @typescript-eslint/no-explicit-any */
import RequireLabel from "@/components/RequireLabel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TierProps } from "@/common/type";
import { Textarea } from "@/components/ui/textarea";
import { memo } from "react";

interface TierCardProps {
  tiers: TierProps[] | undefined;
  addTier: () => void;
  removeTier: (index: number) => void;
  updateTier: (index: number, key: string, value: string | number) => void;
  register: any;
  setValue: any;
  trigger: any;
  errors: any;
}

const TierCard = ({
  tiers,
  addTier,
  removeTier,
  updateTier,
  register,
  setValue,
  trigger,
  errors,
}: TierCardProps) => {
  const handleInputChange = (
    index: number,
    field: string,
    value: string | number,
    parser?: (val: string) => number
  ) => {
    updateTier(index, field, parser ? parser(value.toString()) : value);
    setValue(
      `tiers[${index}].${field}`,
      parser ? parser(value.toString()) : value
    );
    trigger(`tiers[${index}].${field}`);
  };

  const renderTierField = (
    index: number,
    tier: TierProps,
    field: keyof TierProps,
    label: string,
    type = "text",
    parser?: (val: string) => number
  ) => (
    <div className="flex flex-col gap-4">
      <RequireLabel label={label} htmlFor={`tier-${field}-${index}`} />
      <Input
        id={`tier-${field}-${index}`}
        value={tier[field]}
        {...register(`tiers[${index}].${field}`, { required: true })}
        onChange={(e) =>
          handleInputChange(index, field, e.target.value, parser)
        }
        placeholder={`Enter tier ${field}`}
        type={type}
        min={type === "number" ? 0 : undefined}
      />
    </div>
  );

  return (
    <Card className="shadow">
      <CardHeader>
        <CardTitle>Tiers</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between sticky -top-12 bg-white dark:bg-gray-900 p-3 border-b dark:border-gray-700 z-10">
          <Label htmlFor="event-bio" className="mb-2 sm:mb-0 dark:text-white">
            {tiers?.length || 0} Tiers
          </Label>
          <Button
            onClick={addTier}
            className="bg-primary text-primary-foreground rounded-lg"
          >
            Add Tiers
          </Button>
        </div>

        {tiers?.map((tier, index) => (
          <div key={index} className="flex items-center gap-4">
            <Card className="shadow border border-gray-500 dark:border-gray-700 w-full">
              <CardHeader>
                <CardTitle>Tiers</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {renderTierField(index, tier, "name", "Tier Name")}
                  {renderTierField(
                    index,
                    tier,
                    "price",
                    "Tier Price",
                    "number",
                    parseFloat
                  )}
                  {renderTierField(
                    index,
                    tier,
                    "quantity",
                    "Tier Quantity",
                    "number",
                    parseInt
                  )}
                  {renderTierField(
                    index,
                    tier,
                    "royaltyTicketTier",
                    "Tier Royalty",
                    "number",
                    parseInt
                  )}

                  <div className="grid place-items-center">
                    <Button
                      onClick={() => removeTier(index)}
                      variant="destructive"
                      className="w-full sm:w-1/2  dark:hover:bg-gray-700 dark:text-white"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <RequireLabel
                    label="Tier Description"
                    htmlFor={`tier-description-${index}`}
                  />
                  <Textarea
                    id={`tier-description-${index}`}
                    {...register(`tiers[${index}].description`, {
                      required: true,
                    })}
                    value={tier.description}
                    onChange={(e) =>
                      handleInputChange(index, "description", e.target.value)
                    }
                    placeholder="Enter tier description"
                    className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
        {errors.tiers && (
          <span className="text-red-500 text-sm">
            Please check all tier details
          </span>
        )}
      </CardContent>
    </Card>
  );
};

export default memo(TierCard);
