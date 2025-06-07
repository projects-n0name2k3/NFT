/* eslint-disable react-hooks/exhaustive-deps */
import MapDisplay from "@/components/MapDisplay";
import TicketSelector from "@/components/TicketSelector";
import Timer from "@/components/Timer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/axios";
import { dateFormat } from "@/utils/dateFormat";
import { Calendar, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNavigate, useParams } from "react-router";
import { useEvent } from "@/hooks/useEvent";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney } from "@/utils/formatMoney";
import { ticketAbi, tokenAbi } from "@/constants/abi";
import useUserStore from "@/store/user-store";
import { toast } from "sonner";
import useAuthStore from "@/store/auth-store";

interface Ticket {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  price: string;
  totalSupply: number;
  availableSupply: number;
  maxResalePrice: number;
  minResalePrice: number;
  royaltyPercentage: number;
  tierIndex: number;
  description: string;
}

const EventDetail = () => {
  const { eventId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [ticketDetails, setTicketDetails] = useState<Ticket | null>(null);
  const { event: eventDetails, isLoading } = useEvent(eventId!);
  const [estimatedGas, setEstimatedGas] = useState<number | null>(null);
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const [isPending, setIsPending] = useState(false);
  const { user } = useUserStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const handleGetTicket = async (id: string) => {
    try {
      const response = await api.get(`/tickets/${id}`);
      setTicketDetails(response.data.data.ticketTier);
    } catch (error) {
      console.error("Failed to get ticket", error);
    }
  };

  useEffect(() => {
    if (eventDetails) {
      handleGetTicket(eventDetails.ticketTiers[0].id);
    }
  }, [eventDetails]);
  useEffect(() => {
    if (estimatedGas !== null) {
      // Recalculate gas and total cost whenever quantity or ticket changes
      handleEstimateGas();
    }
  }, [estimatedGas]);
  const handleEstimateGas = async () => {
    try {
      // Get provider from window.ethereum
      if (!window.ethereum) {
        console.error("Please install MetaMask or another wallet provider");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contractInstance = new ethers.Contract(
        import.meta.env.VITE_TICKET_MANAGER_PROXY as string,
        ticketAbi,
        signer
      );

      const tokenInstance = new ethers.Contract(
        import.meta.env.VITE_TETHER_USDT as string,
        tokenAbi,
        signer
      );

      // Check if required parameters exist before making the call
      if (!eventDetails?.onChainId || !ticketDetails?.id) {
        console.error(
          "Missing required parameters: onChainId or ticketId is undefined"
        );
        return;
      }
      const decimals = await tokenInstance.decimals();

      // Approve the token transfer
      const approveTx = await tokenInstance.approve(
        import.meta.env.VITE_TICKET_MANAGER_PROXY as string,
        ethers.parseUnits(
          ticketDetails?.price
            ? (parseFloat(ticketDetails.price) * quantity).toString()
            : "0",
          decimals
        )
      );

      // ⚠️ Wait for the transaction to be mined
      await approveTx.wait();

      const gasEstimate = await contractInstance.firstSell.estimateGas(
        eventDetails.onChainId,
        ticketDetails.tierIndex,
        quantity
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
      setEstimatedGas(parseFloat(gasCostInEth));

      // Calculate total cost (ticket price + gas)
      const ticketCost =
        quantity * (ticketDetails?.price ? parseFloat(ticketDetails.price) : 0);
      const totalCost = ticketCost + parseFloat(gasCostInEth);
      setTotalCost(totalCost);
    } catch (error) {
      console.error("Failed to estimate gas", error);
    }
  };

  const handleBuyTicket = async () => {
    try {
      setIsPending(true);
      //change to bscTestnet

      // Get provider from window.ethereum
      if (!window.ethereum) {
        console.error("Please install MetaMask or another wallet provider");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contractInstance = new ethers.Contract(
        import.meta.env.VITE_TICKET_MANAGER_PROXY as string,
        ticketAbi,
        signer
      );

      // Check if required parameters exist before making the call
      if (!eventDetails?.onChainId || !ticketDetails?.id) {
        console.error(
          "Missing required parameters: onChainId or ticketId is undefined"
        );
        return;
      }

      const tx = await contractInstance.firstSell(
        eventDetails.onChainId,
        ticketDetails.tierIndex,
        quantity
      );

      await tx.wait();
      if (tx.hash) {
        setIsPending(false);
        toast.success(
          "Your ticket has been purchased successfully, it will be in your inventory soon."
        );
        navigate(`/profile`);
      }
    } catch (error) {
      console.error("Failed to buy ticket", error);
    } finally {
      setIsPending(false);
      setEstimatedGas(null);
      setTotalCost(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex flex-col gap-4">
          {/* Cover Image Skeleton */}
          <div className="w-full h-[300px] md:h-[400px] relative">
            <Skeleton className="w-full h-full" />
          </div>

          {/* Event details skeleton */}
          <section className="container mx-auto py-6 px-4 bg-white mt-4 rounded shadow">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <div className="grid md:grid-cols-2 gap-8 mt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-5 w-16" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-5 w-20" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                </div>

                <div className="space-y-2 border p-3 rounded hidden md:block">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>

              <div className="flex flex-col items-center gap-6">
                <Skeleton className="w-full max-w-[400px] h-[400px]" />
              </div>
            </div>
          </section>

          {/* Venue Map Skeleton */}
          <section className="container mx-auto bg-muted py-8 bg-white rounded shadow">
            <div className="container mx-auto px-4">
              <Skeleton className="h-8 w-32 mb-6" />
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <Skeleton className="w-full h-[300px]" />
                <div className="space-y-4">
                  <Skeleton className="h-7 w-40" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </div>
          </section>

          {/* Seat map skeleton */}
          <section className="container mx-auto py-8 px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <Skeleton className="h-8 w-32 mb-4" />
                <Skeleton className="w-full h-[450px]" />
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <Skeleton className="h-7 w-40" />
                  </CardHeader>
                  <CardContent className="pt-6 flex flex-col gap-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content */}
      <main className="flex-1">
        {/* Cover Image with Countdown for Desktop */}
        <div className="w-full h-[300px] md:h-[400px] relative">
          <img
            src={eventDetails?.coverPhotoUrl || "/placeholder.svg"}
            alt="Event Cover"
            className="w-full h-full object-cover brightness-75"
          />

          {/* Countdown timer overlay for desktop */}
          <div className="absolute bottom-6 left-0 right-0 px-4">
            <div className="container mx-auto">
              <div className="max-w-md bg-black/70 backdrop-blur-sm p-4 rounded-lg">
                <Timer
                  startTime={eventDetails?.sellStartDate || ""}
                  endTime={eventDetails?.sellEndDate || ""}
                  light={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Event details section */}
        <section className="container mx-auto py-6 px-4">
          <h3 className="text-3xl font-bold">{eventDetails?.name}</h3>
          <div className="grid md:grid-cols-2 gap-8 mt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border">
                  <AvatarImage
                    src={eventDetails?.organizer.thumbnailUrl}
                    alt={eventDetails?.organizer.name}
                  />
                  <AvatarFallback>RD</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm text-muted-foreground">Organizer</div>
                  <div className="font-medium">
                    {eventDetails?.organizer.name}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-medium">Date</div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 w-full text-sm font-medium">
                    <Calendar className="text-gray-600" size={20} />
                    <span>
                      {eventDetails?.eventStartDate
                        ? dateFormat(eventDetails.eventStartDate)
                        : "-"}{" "}
                      -{" "}
                      {eventDetails?.eventEndDate
                        ? dateFormat(eventDetails.eventEndDate)
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-medium">Location</div>
                <div className="flex gap-2 text-sm font-medium">
                  <MapPin className="text-gray-600" size={20} />
                  <span>{eventDetails?.location.locationName}</span>
                </div>
              </div>
              <div className="space-y-2 border p-3 rounded hidden md:block">
                <div className="font-medium">Event description</div>
                <p>{eventDetails?.description}</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6">
              {/* Thumbnail image */}
              <div className="w-full max-w-[400px]">
                <img
                  src={eventDetails?.thumbnailUrl || "/placeholder.svg"}
                  alt={eventDetails?.name}
                  width={400}
                  height={600}
                  className="rounded-md object-cover w-full h-auto max-h-[400px]"
                />
              </div>
            </div>
            <div className="space-y-2 border p-3 rounded block md:hidden">
              <div className="font-medium">Event description</div>
              <p>{eventDetails?.description}</p>
            </div>
          </div>
        </section>

        {/* Venue Map Section */}
        <section className="bg-muted py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Venue</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <MapDisplay
                  latitude={eventDetails?.location.latitude}
                  longitude={eventDetails?.location.longitude}
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />

                  <h3 className="text-xl font-semibold">
                    {eventDetails?.venue}
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
        </section>

        {/* Seat map and ticket selection */}
        <section className="container mx-auto py-8 px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4">Seat Map</h2>
              <img
                src={eventDetails?.seatmapUrl || "/placeholder.svg"}
                alt="Venue"
                width={800}
                height={450}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <Card>
                <CardContent className="pt-6 flex flex-col gap-4">
                  <h2 className="text-xl font-bold mb-4 text-center">
                    Buy tickets for this event
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4 text-center">
                    Please select your ticket type and quantity, then proceed to
                    "Buy now".
                  </p>

                  <div className="space-y-6">
                    <Select
                      value={ticketDetails?.id}
                      defaultValue={eventDetails?.ticketTiers?.[0]?.id}
                      onValueChange={(value) => handleGetTicket(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select ticket type">
                          {ticketDetails?.name || "Select ticket type"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {eventDetails?.ticketTiers?.map((tier) => (
                          <SelectItem key={tier.id} value={tier.id}>
                            {tier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <Card className="p-2">
                      <div className="text-center text-xs">Min resale</div>
                      <div className="text-center font-bold">
                        {ticketDetails?.minResalePrice
                          ? `${ticketDetails.minResalePrice} USDT`
                          : "Not set"}
                      </div>
                    </Card>
                    <Card className="p-2">
                      <div className="text-center text-xs">Max Resale</div>
                      <div className="text-center font-bold">
                        {ticketDetails?.maxResalePrice
                          ? `${ticketDetails.maxResalePrice} USDT`
                          : "Not set"}
                      </div>
                    </Card>
                    <Card className="p-2">
                      <div className="text-center text-xs">Royalty</div>
                      <div className="text-center font-bold">
                        {ticketDetails?.royaltyPercentage}%
                      </div>
                    </Card>
                    <Card className="p-2">
                      <div className="text-center text-xs">Max per wallet</div>
                      <div className="text-center font-bold">
                        {eventDetails?.maxPerUser}
                      </div>
                    </Card>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">
                      Price per ticket
                    </div>
                    <div className="text-3xl font-bold">
                      {formatMoney(
                        ticketDetails?.price
                          ? parseFloat(ticketDetails.price)
                          : 0
                      )}{" "}
                      USDT
                    </div>
                  </div>

                  <TicketSelector
                    quantity={quantity}
                    setQuantity={setQuantity}
                    maxPerUser={Math.min(
                      ticketDetails?.availableSupply || 0,
                      eventDetails?.maxPerUser
                        ? eventDetails.maxPerUser
                        : ticketDetails?.availableSupply || 0
                    )}
                  />

                  <div className="text-sm text-muted-foreground text-center">
                    {ticketDetails?.availableSupply} available
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Price</span>
                      <span className="font-bold">
                        {formatMoney(
                          quantity *
                            (ticketDetails?.price
                              ? parseFloat(ticketDetails.price)
                              : 0)
                        )}{" "}
                        USDT
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Gas Fee</span>
                      <span className="font-bold">{estimatedGas} USDT</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span>Total Cost</span>
                      <span className="font-bold">{totalCost} USDT</span>
                    </div>
                  </div>
                  {user?.role !== "organizer" &&
                    (eventDetails &&
                    (eventDetails.sellStartDate > new Date().toISOString() ||
                      (eventDetails.sellEndDate &&
                        eventDetails.sellEndDate <
                          new Date().toISOString())) ? (
                      <Button
                        variant="destructive"
                        className="w-full"
                        disabled={true}
                      >
                        Tickets are not available yet
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => {
                          if (!isAuthenticated) {
                            navigate("/signin?referrer=%2Fevent%2F" + eventId);
                            return;
                          }
                          if (!estimatedGas) {
                            handleEstimateGas();
                          } else {
                            handleBuyTicket();
                          }
                        }}
                        variant={estimatedGas ? "default" : "outline"}
                        disabled={
                          isPending || ticketDetails?.availableSupply === 0
                        }
                      >
                        {estimatedGas
                          ? isPending
                            ? "Processing..."
                            : "Buy now"
                          : ticketDetails?.availableSupply === 0
                          ? "Sold out"
                          : "Estimate Gas"}
                      </Button>
                    ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EventDetail;
