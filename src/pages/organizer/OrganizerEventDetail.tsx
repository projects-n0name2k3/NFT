import MapDisplay from "@/components/MapDisplay";
import TierCard from "@/components/organizer/event/TierCard";
import Timer from "@/components/Timer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { abi } from "@/constants";
import { useEvent } from "@/hooks/useEvent";
import api from "@/lib/axios";
import { eventService } from "@/services/event";
import { useEventFormStore } from "@/store/event-form";
import { dateFormat } from "@/utils/dateFormat";
import { ethers } from "ethers";
import { Calendar, MapPin } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const OrganizerEventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { event: eventDetails, isLoading } = useEvent(eventId!);
  const { resetForm } = useEventFormStore();
  const [isPublishing, setIsPublishing] = useState(false);
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col dark:bg-gray-900">
        <main className="flex-1 flex flex-col gap-4">
          {/* Cover Image Skeleton */}
          <div className="w-full h-[300px] md:h-[400px] relative">
            <Skeleton className="w-full h-full dark:bg-gray-800" />
          </div>

          {/* Event details skeleton */}
          <section className="container mx-auto py-6 px-4 bg-white dark:bg-gray-800 mt-4 rounded shadow">
            <Skeleton className="h-10 w-3/4 mb-4 dark:bg-gray-700" />
            <div className="grid md:grid-cols-2 gap-8 mt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full dark:bg-gray-700" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20 dark:bg-gray-700" />
                    <Skeleton className="h-5 w-32 dark:bg-gray-700" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-5 w-16 dark:bg-gray-700" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-5 dark:bg-gray-700" />
                    <Skeleton className="h-5 w-40 dark:bg-gray-700" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-5 w-20 dark:bg-gray-700" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-5 dark:bg-gray-700" />
                    <Skeleton className="h-5 w-32 dark:bg-gray-700" />
                  </div>
                </div>

                <div className="space-y-2 border dark:border-gray-700 p-3 rounded hidden md:block">
                  <Skeleton className="h-5 w-32 mb-2 dark:bg-gray-700" />
                  <Skeleton className="h-4 w-full mb-2 dark:bg-gray-700" />
                  <Skeleton className="h-4 w-full mb-2 dark:bg-gray-700" />
                  <Skeleton className="h-4 w-3/4 dark:bg-gray-700" />
                </div>
              </div>

              <div className="flex flex-col items-center gap-6">
                <Skeleton className="w-full max-w-[400px] h-[400px] dark:bg-gray-700" />
              </div>
            </div>
          </section>

          {/* Venue Map Skeleton */}
          <section className="container mx-auto py-8 bg-white dark:bg-gray-800 rounded shadow">
            <div className="container mx-auto px-4">
              <Skeleton className="h-8 w-32 mb-6 dark:bg-gray-700" />
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <Skeleton className="w-full h-[300px] dark:bg-gray-700" />
                <div className="space-y-4">
                  <Skeleton className="h-7 w-40 dark:bg-gray-700" />
                  <Skeleton className="h-4 w-full dark:bg-gray-700" />
                  <Skeleton className="h-4 w-full dark:bg-gray-700" />
                  <Skeleton className="h-4 w-3/4 dark:bg-gray-700" />
                  <Skeleton className="h-10 w-32 dark:bg-gray-700" />
                </div>
              </div>
            </div>
          </section>

          {/* Seat map skeleton */}
          <section className="container mx-auto py-8 px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <Skeleton className="h-8 w-32 mb-4 dark:bg-gray-700" />
                <Skeleton className="w-full h-[450px] dark:bg-gray-700" />
              </div>

              <div>
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <Skeleton className="h-7 w-40 dark:bg-gray-700" />
                  </CardHeader>
                  <CardContent className="pt-6 flex flex-col gap-4">
                    <Skeleton className="h-24 w-full dark:bg-gray-700" />
                    <Skeleton className="h-24 w-full dark:bg-gray-700" />
                    <Skeleton className="h-24 w-full dark:bg-gray-700" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  const handlePublishEvent = async () => {
    try {
      setIsPublishing(true);
      const eventData = {
        ...eventDetails,
        location: `${eventDetails?.location.locationName} ${eventDetails?.location.latitude} ${eventDetails?.location.longitude}`,
      };

      const res = await api.post(`/events/publish`, eventData);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(
        import.meta.env.VITE_EVENT_MANAGER_PROXY as string,
        abi,
        signer
      );
      const tx = await contractInstance.createEvent(
        res.data.data._eventMetadataURL,
        res.data.data._tiers,
        res.data.data._artists,
        res.data.data._saleRule,
        res.data.data._ticketMetadataURL
      );
      await tx.wait(); // Wait for the transaction to be mined
      const result = await eventService.verifyEvent({
        transactionHash: tx.hash,
        eventMetadataUrl: res.data.data._eventMetadataURL,
      });
      if (result.status === 200) {
        resetForm();
        toast.success("Your event would be published soon");
        navigate("/organizer/events");
      }
    } catch (error) {
      console.error("Error publishing event:", error);
      toast.error("Failed to publish event. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      {/* Main content */}
      <main className="flex-1 flex flex-col gap-4">
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
        <section className="container mx-auto py-6 px-4 bg-white dark:bg-gray-800 mt-4 rounded shadow">
          <h3 className="text-3xl font-bold dark:text-white">
            {eventDetails?.name} -{" "}
            <span className="capitalize">{eventDetails?.status}</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-8 mt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border dark:border-gray-700">
                  <AvatarImage
                    src={eventDetails?.organizer.thumbnailUrl}
                    alt={eventDetails?.organizer.name}
                  />
                  <AvatarFallback>RD</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm text-muted-foreground dark:text-gray-400">
                    Organizer
                  </div>
                  <div className="font-medium dark:text-white">
                    {eventDetails?.organizer.name}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-medium dark:text-white">Date</div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 w-full text-sm font-medium dark:text-gray-300">
                    <Calendar
                      className="text-gray-600 dark:text-gray-400"
                      size={20}
                    />
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
                <div className="font-medium dark:text-white">Location</div>
                <div className="flex gap-2 text-sm font-medium dark:text-gray-300">
                  <MapPin
                    className="text-gray-600 dark:text-gray-400"
                    size={20}
                  />
                  <span>{eventDetails?.location.locationName}</span>
                </div>
              </div>
              <div className="space-y-2 border p-3 rounded hidden md:block dark:border-gray-700">
                <div className="font-medium dark:text-white">
                  Event description
                </div>
                <p className="dark:text-gray-300">
                  {eventDetails?.description}
                </p>
              </div>
              {eventDetails?.status === "draft" && (
                <Button
                  onClick={handlePublishEvent}
                  className="w-full hidden md:block"
                  disabled={isPublishing}
                >
                  {isPublishing ? "Publishing..." : "Publish Event"}
                </Button>
              )}
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
            <div className="space-y-2 border p-3 rounded block md:hidden dark:border-gray-700">
              <div className="font-medium dark:text-white">
                Event description
              </div>
              <p className="dark:text-gray-300">{eventDetails?.description}</p>
            </div>
            {eventDetails?.status === "draft" && (
              <Button
                onClick={handlePublishEvent}
                className="w-full md:hidden block"
              >
                Publish Event
              </Button>
            )}
          </div>
        </section>

        {/* Venue Map Section */}
        <section className="container mx-auto py-8 bg-white dark:bg-gray-800 rounded shadow">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Venue</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                {eventDetails?.location.latitude &&
                  eventDetails?.location.longitude && (
                    <MapDisplay
                      latitude={eventDetails?.location.latitude}
                      longitude={eventDetails?.location.longitude}
                    />
                  )}
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />

                  <h3 className="text-xl font-semibold dark:text-white">
                    {eventDetails?.venue}
                  </h3>
                </div>
                <p className="text-muted-foreground dark:text-gray-400">
                  Join us at this iconic venue for an unforgettable experience.
                  The venue features state-of-the-art sound systems, comfortable
                  seating, and excellent visibility from all angles.
                </p>

                <Button
                  variant="outline"
                  className="dark:border-gray-600 dark:text-gray-300"
                >
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Seat map */}
        <section className="container mx-auto py-8 px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4 dark:text-white">
                Seat Map
              </h2>
              <img
                src={eventDetails?.seatmapUrl || "/placeholder.svg"}
                alt="Venue"
                width={800}
                height={450}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">
                    Ticket Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 flex flex-col gap-4">
                  {eventDetails?.ticketTiers.map((tier) => (
                    <TierCard
                      key={tier.id}
                      tier={tier}
                      maxPerUser={eventDetails.maxPerUser}
                    />
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

export default OrganizerEventDetail;
