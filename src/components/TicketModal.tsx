import { TicketCardProps } from "@/common/type";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { marketplaceAbi } from "@/constants/abi";
import { ethers } from "ethers";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface TicketModalProps extends TicketCardProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const TicketModal = ({
  id,
  saleId,
  eventId,
  eventName,
  eventStartDate,
  eventEndDate,
  venue,
  eventThumbnailUrl,
  locationName,
  tierName,
  quantity,
  isOpen,
  setIsOpen,
  status,
}: TicketModalProps) => {
  const navigate = useNavigate();
  const [isCanceling, setIsCanceling] = useState(false);
  const handleCancelResale = async () => {
    try {
      setIsCanceling(true);
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

      const tx = await contractInstance.cancelResellTicket(saleId);
      await tx.wait();
      if (tx.hash) {
        toast.success("Resale canceled successfully!");
        setIsOpen(false);
        setIsCanceling(false);
      }
    } catch (error) {
      setIsCanceling(false);
      console.error("Error canceling resale:", error);
      toast.error("Something went wrong while canceling the resale.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <DialogContent className="p-0 ">
        <div className="flex flex-col ">
          <div className="relative h-[640px]">
            <img
              src={eventThumbnailUrl}
              alt={eventName}
              className="w-full h-full object-cover rounded-md"
            />
            <div className="absolute top-0 right-0 z-50 backdrop-blur-md bg-white/60 dark:bg-black/30 shadow-lg  text-black font-semibold px-3 py-1 m-2 rounded-full text-sm">
              {quantity} available
            </div>

            <div className="absolute z-10 -translate-x-1/2 -translate-y-1/2 left-1/2 top-20 flex items-center justify-center dark:text-gray-300 backdrop-blur-md bg-white/60 dark:bg-black/30 shadow-lg rounded-full">
              <p className="text-4xl font-semibold px-12 py-3 tracking-wider">
                {tierName}
              </p>
            </div>

            <div className="absolute z-10 p-6 bottom-0 w-full backdrop-blur-md bg-white/60 dark:bg-black/30 border-t shadow-lg rounded-t-xl">
              <h2 className="text-2xl font-bold  dark:text-white mb-2 text-center">
                {eventName}
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4 w-full">
                    <div className="h-px flex-1 bg-black"></div>
                    <span className="font-medium">Date</span>
                    <div className="h-px flex-1 bg-black"></div>
                  </div>
                  <span className="text-center font-bold text-xl">
                    {new Date(eventStartDate)
                      .toLocaleString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                      .replace("12:00 AM", "00:00 AM")}
                    {", "}
                    {new Date(eventStartDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    -{" "}
                    {new Date(eventEndDate).toLocaleString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {", "}
                    {new Date(eventEndDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center dark:text-gray-300 space-x-2">
                  <div className="flex flex-col w-full gap-2">
                    <div className="flex items-center gap-4 w-full">
                      <div className="h-px flex-1 bg-black"></div>
                      <span className="font-medium">Venue</span>
                      <div className="h-px flex-1 bg-black"></div>
                    </div>
                    <span className="text-center font-bold text-xl">
                      {venue}
                      {locationName &&
                        ", " +
                          (locationName.includes(", ")
                            ? locationName.split(", ").slice(-2).join(", ")
                            : locationName)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => navigate(`/event/${eventId}`)}
                >
                  View Event Details
                </Button>
                {status === "selling" ? (
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full"
                    onClick={handleCancelResale}
                    disabled={isCanceling}
                  >
                    {isCanceling ? "Canceling..." : "Cancel Resell"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="flex-1"
                    variant={"outline"}
                    onClick={() => navigate(`/resale/${id}`)}
                  >
                    Resell Ticket
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TicketModal;
