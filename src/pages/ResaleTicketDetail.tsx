/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney } from "@/utils/formatMoney";
import { marketplaceAbi, tokenAbi } from "@/constants/abi";
import useUserStore from "@/store/user-store";
import { toast } from "sonner";
import { useMarketplace } from "@/hooks/useMarketplace";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useAuthStore from "@/store/auth-store";

const ResaleEventDetail = () => {
  const { eventId } = useParams();
  const [quantityMap, setQuantityMap] = useState<any>({});
  const [ticketDetails, setTicketDetails] = useState<any | null>(null);
  const { event: eventDetails, isLoading } = useMarketplace(eventId!);
  const [estimatedGas, setEstimatedGas] = useState<number | null>(null);
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const { user } = useUserStore();
  const [isEstimating, setIsEstimating] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const navigate = useNavigate();
  const handleGetTicket = async (id: string) => {
    try {
      const response = await api.get(`/tickets/resale/details/${id}`);
      console.log("Response data:", response.data.data);
      // Convert object of objects to array
      const ticketsArray = Object.values(response.data.data);
      console.log("Converted to array:", ticketsArray);
      setTicketDetails(ticketsArray);
      // setTicketDetails(response.data.data);
    } catch (error) {
      console.error("Failed to get ticket", error);
    }
  };

  useEffect(() => {
    if (eventDetails) {
      handleGetTicket(eventDetails.ticketTiers[0].id);
    }
  }, [eventDetails]);

  const handleEstimateGas = async (
    saleId: number,
    quantity: number,
    price: number,
    ticketId: string
  ) => {
    try {
      console.log(saleId, quantity, price, ticketId);
      setIsEstimating(true);
      setSelectedTicket(ticketId);
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

      const tokenInstance = new ethers.Contract(
        import.meta.env.VITE_TETHER_USDT as string,
        tokenAbi,
        signer
      );

      // Check if required parameters exist before making the call
      if (!saleId || !quantity) {
        console.error(
          "Missing required parameters: saleId or quantity is undefined"
        );
        setIsEstimating(false);
        return;
      }
      const decimals = await tokenInstance.decimals();

      const approveTx = await tokenInstance.approve(
        import.meta.env.VITE_MARKETPLACE_PROXY as string,
        ethers.parseUnits(price ? (price * quantity).toString() : "0", decimals)
      );

      // ⚠️ Wait for the transaction to be mined
      await approveTx.wait();
      const gasEstimate = await contractInstance.buyTicket.estimateGas(
        saleId,
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
      const ticketCost = quantity * price;
      const totalCost = ticketCost + parseFloat(gasCostInEth);
      setTotalCost(totalCost);

      setIsEstimating(false);
    } catch (error: any) {
      setIsEstimating(false);

      const revertReason =
        error?.revert?.args?.[0] || error?.reason || "Transaction failed";
      toast.error(revertReason);
    }
  };

  const handleBuyTicket = async (saleId: number, quantity: number) => {
    try {
      setIsBuying(true);
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

      // Check if required parameters exist before making the call
      if (!saleId || !quantity) {
        console.error(
          "Missing required parameters: saleId or quantity is undefined"
        );
        setIsBuying(false);
        setIsEstimating(false);
        return;
      }

      const tx = await contractInstance.buyTicket(saleId, quantity);

      await tx.wait();
      if (tx.hash) {
        toast.success(
          "Your ticket has been purchased successfully, it will be in your profile"
        );
        navigate("/profile");
      }
    } catch (error: any) {
      setIsBuying(false);
      const revertReason =
        error?.revert?.args?.[0] || error?.reason || "Transaction failed";
      toast.error(revertReason);
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
  const updateQuantity = (ticketId: string, newQuantity: number) => {
    setEstimatedGas(null);
    setTotalCost(null);
    if (selectedTicket !== ticketId) {
      console.log(selectedTicket, ticketId);

      setSelectedTicket(null);
    }
    setQuantityMap((prev: any) => ({
      ...prev,
      [ticketId]: newQuantity,
    }));
  };

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
                <Timer endTime={eventDetails?.sellEndDate || ""} light={true} />
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

                  <h3 className="text-xl font-semibold">TP Buidling</h3>
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
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4">Seat Map</h2>
              <img
                src={eventDetails?.seatmapUrl || "/placeholder.svg"}
                alt="Venue"
                className="w-full h-full "
              />
            </div>

            <div className="col-span-2">
              <Card>
                <CardContent className="pt-6 flex flex-col gap-4">
                  <h2 className="text-xl font-bold mb-4 text-center">
                    Buy resale tickets for this event
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4 text-center">
                    Please select your ticket type and quantity, then proceed to
                    "Buy now".
                  </p>

                  <div className="space-y-6">
                    <Select
                      value={ticketDetails?.[0].tierId}
                      defaultValue={eventDetails?.ticketTiers?.[0]?.id}
                      onValueChange={(value) => handleGetTicket(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select ticket type">
                          {ticketDetails?.[0].tierName || "Select ticket type"}
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
                        {ticketDetails?.[0].minResalePrice
                          ? `${ticketDetails?.[0].minResalePrice} USDT`
                          : "Not set"}
                      </div>
                    </Card>
                    <Card className="p-2">
                      <div className="text-center text-xs">Max Resale</div>
                      <div className="text-center font-bold">
                        {ticketDetails?.[0].maxResalePrice
                          ? `${ticketDetails?.[0].maxResalePrice} USDT`
                          : "Not set"}
                      </div>
                    </Card>
                    <Card className="p-2">
                      <div className="text-center text-xs">Royalty</div>
                      <div className="text-center font-bold">
                        {ticketDetails?.[0].royaltyPercentage}%
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
                        ticketDetails?.[0].rawPrice
                          ? parseFloat(ticketDetails?.[0].rawPrice)
                          : 0
                      )}{" "}
                      USDT
                    </div>
                  </div>

                  <Table>
                    <TableCaption>A list of sellers.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Seller</TableHead>
                        <TableHead className="max-w-[100px] ">
                          Seller's wallet
                        </TableHead>
                        <TableHead className="text-center">
                          Resale Time
                        </TableHead>
                        <TableHead>Resale Price</TableHead>
                        <TableHead>Remain Quantity</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-center w-[150px]">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ticketDetails &&
                        ticketDetails
                          .filter(
                            (ticket: any) =>
                              ticket.sellerWalletAddress !== user?.walletAddress
                          )
                          .map((ticket: any) => (
                            <TableRow key={ticket.id}>
                              <TableCell className="font-medium">
                                {ticket.sellerName}
                              </TableCell>
                              <TableCell className="max-w-[150px] truncate whitespace-nowrap overflow-hidden">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="cursor-default">
                                        {ticket.sellerWalletAddress}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                      {ticket.sellerWalletAddress}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableCell>
                              <TableCell className="text-center">
                                {new Date(ticket.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </TableCell>

                              <TableCell>{ticket.price}</TableCell>
                              <TableCell>{ticket.quantity}</TableCell>
                              <TableCell>
                                <TicketSelector
                                  quantity={quantityMap[ticket.id] || 1} // Lấy số lượng từ map hoặc mặc định là 1
                                  setQuantity={(newQuantity) =>
                                    updateQuantity(ticket.id, newQuantity)
                                  }
                                  maxPerUser={ticket.quantity}
                                />
                              </TableCell>
                              <TableCell className="text-center">
                                <Button
                                  variant={
                                    estimatedGas
                                      ? ticket.id === selectedTicket
                                        ? "default"
                                        : "outline"
                                      : "outline"
                                  }
                                  onClick={() => {
                                    if (!isAuthenticated) {
                                      navigate(
                                        "/signin?referrer=%2Fmarketplace%2F" +
                                          eventId
                                      );
                                      return;
                                    }
                                    if (estimatedGas) {
                                      handleBuyTicket(
                                        ticket.sale_id,
                                        quantityMap[ticket.id] || 1
                                      );
                                    } else {
                                      handleEstimateGas(
                                        ticket.sale_id,
                                        quantityMap[ticket.id] || 1,
                                        (quantityMap[ticket.id] || 1) *
                                          ticket.price,
                                        ticket.id
                                      );
                                    }
                                  }}
                                  disabled={isEstimating || isBuying}
                                >
                                  {!estimatedGas
                                    ? isEstimating &&
                                      selectedTicket === ticket.id
                                      ? "Estimating..."
                                      : "Estimate Gas"
                                    : selectedTicket === ticket.id
                                    ? isBuying
                                      ? "Buying..."
                                      : "Buy Now"
                                    : "Estimate Gas"}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between"></div>
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
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ResaleEventDetail;
