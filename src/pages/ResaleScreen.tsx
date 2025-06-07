/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card1, Card2 } from "@/assets/images";
import MapDisplay from "@/components/MapDisplay";
import TicketSelector from "@/components/TicketSelector";
import Timer from "@/components/Timer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { marketplaceAbi } from "@/constants/abi";
import api from "@/lib/axios";
import { ethers } from "ethers";
import { Clock, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const ResaleScreen = () => {
  const { ticketId } = useParams();
  const [data, setData] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [estimatedGas, setEstimatedGas] = useState<any>(null);
  const [isReselling, setIsReselling] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const handleGetTicket = async () => {
      const res = await api.get(`/tickets/details/${ticketId}`);
      console.log(res.data.data);
      setData(res.data.data);
    };

    handleGetTicket();
  }, [ticketId]);
  const [resalePrice, setResalePrice] = useState<any>();
  useEffect(() => {
    if (data) {
      setResalePrice(data?.ticketTier?.minResalePrice);
    }
  }, [data]);

  const handleEstimateGas = async () => {
    try {
      // Get provider from window.ethereum
      setIsEstimating(true);
      if (!window.ethereum) {
        console.error("Please install MetaMask or another wallet provider");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contractInstance = new ethers.Contract(
        import.meta.env.VITE_MARKETPLACE_PROXY as string,
        marketplaceAbi,
        signer
      );
      const contractABI = [
        "function setApprovalForAll(address operator, bool approved) public",
        "function isApprovedForAll(address owner, address operator) public view returns (bool)",
        "function balanceOf(address account, uint256 id) public view returns (uint256)",
      ];
      const ticketInstance = new ethers.Contract(
        data?.event?.ticketAddress,
        contractABI,
        signer
      );

      // Check if required parameters exist before making the call
      if (!data?.event?.onchainId || !data?.event?.ticketAddress) {
        console.error(
          "Missing required parameters: onChainId or ticketId is undefined"
        );
        return;
      }
      const tx = await ticketInstance.setApprovalForAll(
        import.meta.env.VITE_MARKETPLACE_PROXY as string,
        true
      );
      await tx.wait();

      const gasEstimate = await contractInstance.resellTicket.estimateGas(
        data?.event?.onchainId,
        data?.event?.ticketAddress,
        data?.ticketTier?.tierIndex,
        resalePrice,
        quantity,
        import.meta.env.VITE_TETHER_USDT as string
      );

      // Convert gas estimate to a number for easier handling
      const gasEstimateNumber = Number(gasEstimate);

      // Get current gas price using getFeeData
      const feeData = await provider.getFeeData();
      const gasPriceInWei = feeData.gasPrice || 0n;

      // Calculate total gas cost (gas units × gas price)
      const gasCostInWei = gasEstimateNumber * Number(gasPriceInWei);

      // Convert wei to ETH and set estimated gas
      const gasCostInEth = ethers.formatEther(gasCostInWei.toString());
      setEstimatedGas(gasCostInEth);
      setIsEstimating(false);
    } catch (error) {
      setIsEstimating(false);
      console.error(error);
    }
  };

  const handleResaleTicket = async () => {
    try {
      setIsReselling(true);
      // Get provider from window.ethereum
      if (!window.ethereum) {
        console.error("Please install MetaMask or another wallet provider");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contractInstance = new ethers.Contract(
        import.meta.env.VITE_MARKETPLACE_PROXY as string,
        marketplaceAbi,
        signer
      );
      const tx = await contractInstance.resellTicket(
        data?.event?.onchainId,
        data?.event?.ticketAddress,
        data?.ticketTier?.tierIndex,
        resalePrice,
        quantity,
        import.meta.env.VITE_TETHER_USDT as string
      );
      await tx.wait();
      if (tx.hash) {
        toast.success(
          "Your ticket has been resold successfully, it will be on the marketplace soon"
        );
        setIsReselling(false);
        navigate(`/profile/resaling`);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while reselling the ticket");
      setIsReselling(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content */}
      <main className="flex-1 space-y-4">
        {/* Cover Image with Countdown for Desktop */}
        <div className="w-full h-[300px] md:h-[400px] relative">
          <img
            src={data?.event?.coverPhotoUrl}
            alt="Event Cover"
            className="w-full h-full object-cover brightness-75"
          />

          {/* Countdown timer overlay for desktop */}
          <div className="absolute bottom-6 left-0 right-0 px-4">
            <div className="container mx-auto">
              <div className="max-w-md bg-black/70 backdrop-blur-sm p-4 rounded-lg">
                <Timer
                  endTime={new Date(data?.event?.sellEndDate).toString()}
                  light={true}
                  startTime={new Date(data?.event?.sellStartDate).toString()}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Seat map and ticket selection */}
        <Card className="container mx-auto py-8 px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4">Seat Map</h2>
              <img
                src={data?.event?.seatmapUrl}
                alt="Venue"
                className="object-cover"
              />
            </div>

            <div>
              <Card>
                <CardContent className="pt-6 flex flex-col gap-4">
                  <h2 className="text-xl font-bold mb-4 text-center">
                    Resale Ticket
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4 text-center">
                    You are about to resale a ticket tier{" "}
                    <span className="text-black font-bold">
                      {data?.ticketTier?.name}
                    </span>{" "}
                    for{" "}
                    <span className="text-black font-semibold">
                      {data?.event?.name}
                    </span>
                  </p>

                  <div className="grid grid-cols-4 gap-2">
                    <Card className="p-2">
                      <div className="text-center text-xs">
                        Min resale price
                      </div>
                      <div className="text-center font-bold">
                        {data?.ticketTier?.minResalePrice} USDT
                      </div>
                    </Card>
                    <Card className="p-2">
                      <div className="text-center text-xs">
                        Max resale price
                      </div>
                      <div className="text-center font-bold">
                        {data?.ticketTier?.maxResalePrice} USDT
                      </div>
                    </Card>
                    <Card className="p-2">
                      <div className="text-center text-xs">Royalty</div>
                      <div className="text-center font-bold">
                        {data?.ticketTier?.royaltyPercentage}%
                      </div>
                    </Card>
                    <Card className="p-2">
                      <div className="text-center text-xs">Max per wallet</div>
                      <div className="text-center font-bold">
                        {data?.event?.maxPerUser}
                      </div>
                    </Card>
                  </div>
                  <Card>
                    <CardContent className="p-2">
                      <p className="font-semibold">Ticket's description</p>
                      <p className="text-sm text-muted-foreground p-2">
                        {data?.ticketTier?.description}
                      </p>
                    </CardContent>
                  </Card>

                  <div>
                    <div className="text-sm font-medium mb-2">Raw Price</div>
                    <div className="text-3xl font-bold">
                      {data?.ticketTier?.price} USDT
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="text-sm font-medium">Resale Price</div>
                      <Input
                        placeholder="Enter Resale Price"
                        type="number"
                        className="w-full"
                        max={data?.ticketTier?.maxResalePrice}
                        min={data?.ticketTier?.minResalePrice}
                        value={resalePrice}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (value >= data?.ticketTier?.minResalePrice) {
                            setResalePrice(value);
                          }
                          if (value < data?.ticketTier?.minResalePrice) {
                            setResalePrice(data?.ticketTier?.minResalePrice);
                          }
                          if (value > data?.ticketTier?.maxResalePrice) {
                            setResalePrice(data?.ticketTier?.maxResalePrice);
                          }
                          if (value < 0) {
                            setResalePrice(data?.ticketTier?.minResalePrice);
                          }
                        }}
                        step={0.01}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Quantity</Label>
                      <TicketSelector
                        quantity={quantity}
                        setQuantity={setQuantity}
                        maxPerUser={
                          Math.min(
                            data?.event?.maxPerUser,
                            data?.nftTicket?.quantity
                          ) || 0
                        }
                      />
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground text-center">
                    {data?.nftTicket?.quantity} available
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Estimated Gas Fee</span>
                      <span className="font-bold">{estimatedGas} USDT</span>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    variant={estimatedGas ? "default" : "outline"}
                    onClick={
                      estimatedGas ? handleResaleTicket : handleEstimateGas
                    }
                    disabled={
                      !resalePrice ||
                      data?.nftTicket?.quantity === 0 ||
                      isReselling ||
                      isEstimating
                    }
                  >
                    {data?.nftTicket?.quantity === 0
                      ? "Out of Tickets"
                      : isEstimating
                      ? "Estimating..."
                      : !estimatedGas
                      ? "Estimate Gas"
                      : isReselling
                      ? "Reselling..."
                      : "Resell Ticket"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Card>
        {/* Event details section */}
        <Card className="container mx-auto py-6 px-4">
          <h3 className="text-3xl font-bold">{data?.event?.name}</h3>
          <div className="grid md:grid-cols-2 gap-8 mt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border">
                  <AvatarImage
                    src={data?.organizer?.thumbnailUrl || Card1}
                    alt={"Godmother"}
                  />
                  <AvatarFallback>RD</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm text-muted-foreground">Organizer</div>
                  <div className="font-medium">{data?.organizer?.name}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-medium">Time</div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 w-full text-sm font-medium">
                    <Clock className="text-gray-600" size={20} />
                    <span className="text-sm">
                      {new Date(data?.event?.eventStartDate)
                        .toLocaleString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                        .replace("12:00 AM", "00:00 AM")}
                      {", "}
                      {new Date(data?.event?.eventStartDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        }
                      )}{" "}
                      -{" "}
                      {new Date(data?.event?.eventEndDate).toLocaleString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                      {", "}
                      {new Date(data?.event?.eventEndDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium">Location</div>
                <div className="flex gap-2 text-sm font-medium">
                  <MapPin className="text-gray-600" size={20} />
                  <span>{data?.event?.location?.locationName}</span>
                </div>
              </div>
              <div className="space-y-2 border p-3 rounded hidden md:block">
                <div className="font-medium">Event description</div>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit
                  voluptatem similique amet distinctio quasi pariatur optio est!
                  Corrupti repudiandae quis harum molestiae magni accusantium
                  vitae facilis! Inventore, recusandae minus! Eaque.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6">
              {/* Thumbnail image */}
              <div className="w-full max-w-[400px]">
                <img
                  src={data?.event?.thumbnailUrl || Card2}
                  alt={data?.event?.name}
                  width={400}
                  height={600}
                  className="rounded-md object-cover w-full h-auto max-h-[400px]"
                />
              </div>
            </div>
            <div className="space-y-2 border p-3 rounded block md:hidden">
              <div className="font-medium">Event description</div>
              <p>{data?.event?.description}</p>
            </div>
          </div>
        </Card>

        {/* Venue Map Section */}
        <Card className="py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Venue</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <MapDisplay
                  latitude={data?.event?.location?.latitude}
                  longitude={data?.event?.location?.longitude}
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />

                  <h3 className="text-xl font-semibold">
                    {data?.event?.venue}
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  Join us at this iconic venue for an unforgettable experience.
                  The venue features state-of-the-art sound systems, comfortable
                  seating, and excellent visibility from all angles.
                </p>

                <Button variant="outline">Get Directions</Button>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ResaleScreen;
