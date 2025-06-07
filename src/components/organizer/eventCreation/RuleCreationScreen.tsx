import RequireLabel from "@/components/RequireLabel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEventFormStore } from "@/store/event-form";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

const RuleCreationScreen = () => {
  const {
    artistClasses,
    updateArtistClasses,
    updateRoyaltyPercent,
    tiers,
    maxTicketPerWallet,
    updateField,
  } = useEventFormStore();

  const {
    register,
    formState: { errors },
    setValue,
    trigger,
  } = useFormContext();

  useEffect(() => {
    updateArtistClasses();
  }, [updateArtistClasses]);

  const handleSetRoyalty = (index: number, percent: number) => {
    if (artistClasses && artistClasses[index]) {
      updateRoyaltyPercent(artistClasses[index].name, percent);
    }
  };

  const updateTier = (index: number, field: string, value: string | number) => {
    const updatedTiers = [...(tiers || [])];
    updatedTiers[index] = {
      ...updatedTiers[index],
      [field]: value,
    };
    updateField("tiers", updatedTiers);
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-3 w-full min-h-screen gap-4">
      <div className="lg:h-[800px] lg:sticky lg:top-0 mb-4 lg:mb-0">
        <Card className="h-full w-full shadow flex flex-col">
          <CardHeader>
            <CardTitle>Sale Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <RequireLabel
                label="Max Tickets Per Wallet"
                htmlFor="max-per-wallet"
              />
              <Input
                id={"max-per-wallet"}
                placeholder="Enter max tickets per wallet"
                type="number"
                {...register("maxTicketPerWallet", { required: true })}
                value={maxTicketPerWallet || ""}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : "";
                  setValue("maxTicketPerWallet", value);
                  updateField("maxTicketPerWallet", value);
                  trigger("maxTicketPerWallet");
                }}
                min={0}
              />
              {errors.maxTicketPerWallet && (
                <span className="text-red-500 text-sm">
                  Please enter the maximum number of tickets per wallet
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2 flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Resale Rules</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Card className="h-full w-full shadow flex flex-col">
              <CardHeader>
                <CardTitle>Artist Royalty Levels</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {artistClasses &&
                  artistClasses.map((artistClass, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border p-3 rounded"
                    >
                      <div className="flex flex-col gap-2">
                        <Label>Class</Label>
                        <Input value={artistClass.name} disabled />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>Quantity</Label>
                        <Input value={artistClass.artistCount} disabled />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>Royalty Percent</Label>
                        <Input
                          type="number"
                          placeholder="Enter royalty percent"
                          id={`royalty-percent-${index}`}
                          min={0}
                          max={100}
                          value={artistClass.royaltyPercent}
                          onChange={(e) =>
                            handleSetRoyalty(
                              artistClasses.indexOf(artistClass),
                              parseInt(e.target.value)
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
            <Card className="h-full w-full shadow flex flex-col">
              <CardHeader>
                <CardTitle>Resale Price Range</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {tiers &&
                  tiers.map((tier, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 border rounded p-3 "
                    >
                      <div className="flex flex-col gap-2">
                        <Label>Tier</Label>
                        <Input value={tier.name} disabled />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>Current Price (ETH)</Label>
                        <Input value={tier.price} disabled />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>Max Resale Price (ETH)</Label>
                        <Input
                          type="number"
                          placeholder="Enter max resale price"
                          min={0}
                          value={tier.maxResalePrice}
                          onChange={(e) =>
                            updateTier(index, "maxResalePrice", +e.target.value)
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>Min Resale Price (ETH)</Label>
                        <Input
                          type="number"
                          placeholder="Enter min resale price"
                          min={0}
                          max={tier.maxResalePrice}
                          value={tier.minResalePrice}
                          onChange={(e) => {
                            if (
                              !tier.maxResalePrice ||
                              parseInt(e.target.value) > tier.maxResalePrice
                            ) {
                              toast.error(
                                "Min resale price cannot be greater than max resale price"
                              );
                            } else {
                              updateTier(
                                index,
                                "minResalePrice",
                                +e.target.value
                              );
                            }
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RuleCreationScreen;
