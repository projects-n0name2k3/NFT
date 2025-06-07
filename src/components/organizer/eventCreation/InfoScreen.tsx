import type React from "react";
import { useEventFormStore } from "@/store/event-form";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import ImageSection from "@/components/organizer/ImageSection";
import RequireLabel from "@/components/RequireLabel";
import { toast } from "sonner";
import { useFormContext } from "react-hook-form";
import InputField from "@/components/organizer/eventCreation/InputField";
import MapSection from "@/components/organizer/eventCreation/MapSection";
import EventPeriodComponent from "@/components/organizer/eventCreation/EventPeriodComponent";

export default function InfoScreen() {
  const {
    eventStartTime,
    eventStartDate,
    eventEndDate,
    eventEndTime,
    updateField,
    thumbnail,
    coverPhoto,
    previewThumbnail,
    previewCoverPhoto,
  } = useEventFormStore();
  const [previewAvatar, setPreviewAvatar] = useState<
    string | ArrayBuffer | undefined
  >(previewThumbnail);
  const [previewCover, setPreviewCover] = useState<
    string | ArrayBuffer | undefined
  >(previewCoverPhoto);
  const { setValue, trigger } = useFormContext(); // Access form context
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      e.target.name === "eventStartTime" ||
      e.target.name === "eventEndTime"
    ) {
      if (!eventStartDate || !eventEndDate) {
        toast.error("Please select start and end date first");
        return;
      }
      if (eventStartDate === eventEndDate) {
        if (e.target.name === "eventStartTime") {
          if (eventEndTime && e.target.value > eventEndTime) {
            toast.error("Start time cannot be later than end time");
            return;
          }
        }
        if (e.target.name === "eventEndTime") {
          if (eventStartTime && e.target.value < eventStartTime) {
            toast.error("End time cannot be earlier than start time");
            return;
          }
        }
      }
    }

    updateField(e.target.name, e.target.value);
    setValue(e.target.name, e.target.value);
    trigger(e.target.name);
  };

  const handleChangeImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "avatar") {
          setPreviewAvatar(reader.result!);
          updateField("previewThumbnail", reader.result);
          updateField("thumbnail", file);
        } else {
          setPreviewCover(reader.result!);
          updateField("previewCoverPhoto", reader.result);
          updateField("coverPhoto", file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <InputField
        field="name"
        label="Event Name"
        handleInputChange={handleInputChange}
        placeholder="Enter event name"
      />

      <Card className="p-3 space-y-3 shadow">
        <RequireLabel label="Event Times" />
        <EventPeriodComponent
          eventStartDate={eventStartDate}
          eventStartTime={eventStartTime}
          eventEndDate={eventEndDate}
          eventEndTime={eventEndTime}
          updateField={updateField}
          handleInputChange={handleInputChange}
        />
      </Card>

      <InputField
        field="venue"
        label="Event Venue"
        placeholder="Enter event venue"
        handleInputChange={handleInputChange}
      />

      <MapSection />

      <ImageSection
        primaryLabel="Upload Cover Photo"
        primaryImage={previewCover || coverPhoto}
        secondaryLabel="Upload Thumbnail"
        secondaryImage={previewAvatar || thumbnail}
        handleChangeImage={handleChangeImage}
      />
    </div>
  );
}
