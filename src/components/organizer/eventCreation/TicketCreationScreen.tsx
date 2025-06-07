import EventPeriodComponent from "@/components/organizer/eventCreation/EventPeriodComponent";
import SaleTimeCard from "@/components/organizer/eventCreation/SaleTimeCard";
import SeatmapSection from "@/components/organizer/eventCreation/SeatmapSection";
import TierCard from "@/components/organizer/eventCreation/TierCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEventFormStore } from "@/store/event-form";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

const TicketCreationScreen = () => {
  const {
    tiers,
    eventStartDate,
    eventEndDate,
    ticketStartDate,
    ticketEndDate,
    ticketStartTime,
    ticketEndTime,
    previewSeatMap,
    updateField,
    addTier,
  } = useEventFormStore();

  const {
    register,
    formState: { errors },
    setValue,
    trigger,
  } = useFormContext();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "ticketStartTime") {
      if (!ticketStartDate || !ticketEndDate) {
        toast.error("Please select start and end date first");
        return;
      }
      if (ticketStartDate === ticketEndDate) {
        if (value > ticketEndDate) {
          toast.error("Start time cannot be later than end time");
          return;
        }
      }
    }
    if (name === "ticketEndTime") {
      if (!ticketStartDate || !ticketEndDate) {
        toast.error("Please select start and end date first");
        return;
      }
      if (ticketStartDate === ticketEndDate) {
        console.log(value);
        if (value < ticketStartTime) {
          toast.error("End time cannot be before start time");
          return;
        }
      }
    }
    updateField(name, value);
  };

  const removeTier = (index: number) => {
    updateField(
      "tiers",
      (tiers || []).filter((_, i) => i !== index)
    );
  };

  const updateTier = (index: number, field: string, value: string | number) => {
    const updatedTiers = [...(tiers || [])];
    updatedTiers[index] = {
      ...updatedTiers[index],
      [field]: value,
    };
    updateField("tiers", updatedTiers);
  };

  const handleSeatmapUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      updateField("previewSeatMap", URL.createObjectURL(file));
      updateField("seatMap", file);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-4">
      <SeatmapSection
        title="Seat Map"
        uploadTitle="Upload a seat map for your event. This will help attendees to choose their seats."
        handleSeatmapUpload={handleSeatmapUpload}
        previewSeatmap={previewSeatMap}
      />
      <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Event Period</CardTitle>
          </CardHeader>
          <CardContent>
            <EventPeriodComponent
              eventStartDate={eventStartDate}
              eventEndDate={eventEndDate}
              updateField={updateField}
              handleInputChange={handleInputChange}
            />
          </CardContent>
        </Card>
        <SaleTimeCard
          ticketStartDate={ticketStartDate}
          ticketStartTime={ticketStartTime}
          ticketEndDate={ticketEndDate}
          ticketEndTime={ticketEndTime}
          eventStartDate={eventStartDate}
          eventEndDate={eventEndDate}
          updateField={updateField}
          handleInputChange={handleInputChange}
        />
        <TierCard
          errors={errors}
          register={register}
          setValue={setValue}
          trigger={trigger}
          tiers={tiers}
          addTier={addTier}
          removeTier={removeTier}
          updateTier={updateTier}
        />
      </div>
    </div>
  );
};

export default TicketCreationScreen;
