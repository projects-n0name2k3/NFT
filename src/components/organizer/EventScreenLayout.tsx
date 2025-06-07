/* eslint-disable @typescript-eslint/no-explicit-any */
import StepSection from "@/components/organizer/StepSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { steps } from "@/constants/createEventSteps";
import { useSaveEvent } from "@/hooks/useSaveEvent";
import { useEventFormStore } from "@/store/event-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Outlet, useLocation, useNavigate } from "react-router";
import { ethers } from "ethers";
import { abi } from "@/constants";
import { eventService } from "@/services/event";
import { formMaker } from "@/utils/formMaker";
import { toast } from "sonner";
import { NavigationPrompt } from "@/components/NavigationPrompt";
const EventScreenLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { saveEvent, isPending } = useSaveEvent();
  const { resetForm, resetImage } = useEventFormStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const currentStepIndex = useMemo(
    () => steps.findIndex((step) => pathname.includes(step.path.split("/")[1])),
    [pathname]
  );
  const eventFormData = useEventFormStore();

  useEffect(() => {
    if (isPublished) {
      navigate("/organizer/events");
    }
  }, [isPublished, navigate]);

  const methods = useForm({
    resolver: zodResolver<any>(steps[currentStepIndex]?.schema),
    defaultValues: {
      name: eventFormData.name,
      eventStartDate: eventFormData.eventStartDate,
      eventEndDate: eventFormData.eventEndDate,
      eventStartTime: eventFormData.eventStartTime,
      eventEndTime: eventFormData.eventEndTime,
      location: eventFormData.location,
      venue: eventFormData.venue,
      description: eventFormData.description,
      artists: eventFormData.artists,
      ticketStartDate: eventFormData.ticketStartDate,
      ticketEndDate: eventFormData.ticketEndDate,
      ticketStartTime: eventFormData.ticketStartTime,
      ticketEndTime: eventFormData.ticketEndTime,
      tiers: eventFormData.tiers,
      maxTicketPerWallet: eventFormData.maxTicketPerWallet,
    },
    values: {
      name: eventFormData.name,
      eventStartDate: eventFormData.eventStartDate,
      eventEndDate: eventFormData.eventEndDate,
      eventStartTime: eventFormData.eventStartTime,
      eventEndTime: eventFormData.eventEndTime,
      location: eventFormData.location,
      venue: eventFormData.venue,
      description: eventFormData.description,
      artists: eventFormData.artists,
      ticketStartDate: eventFormData.ticketStartDate,
      ticketEndDate: eventFormData.ticketEndDate,
      ticketStartTime: eventFormData.ticketStartTime,
      ticketEndTime: eventFormData.ticketEndTime,
      tiers: eventFormData.tiers,
      maxTicketPerWallet: eventFormData.maxTicketPerWallet,
    },
  });

  const handleContinue = useCallback(() => {
    methods.handleSubmit(() => {
      if (currentStepIndex < steps.length - 1) {
        navigate(steps[currentStepIndex + 1].path);
      }
    })();
  }, [currentStepIndex, methods, navigate]);

  const handleBack = useCallback(() => {
    if (currentStepIndex > 0) {
      navigate(steps[currentStepIndex - 1].path);
    }
  }, [currentStepIndex, navigate]);
  const handleCreateEvent = useCallback(async () => {
    try {
      const formData = formMaker(eventFormData);
      saveEvent(formData);
      setIsPublished(true);
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Failed to save event. Please try again.");
    }
  }, [eventFormData, saveEvent]);

  const isCreationFlow = useMemo(
    () => pathname.split("/").includes("new"),
    [pathname]
  );

  const handlePublishEvent = useCallback(async () => {
    try {
      setIsLoading(true);
      const formData = formMaker(eventFormData);

      const res = await eventService.pubishEvent(formData);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(
        import.meta.env.VITE_EVENT_MANAGER_PROXY as string,
        abi,
        signer
      );

      const tx = await contractInstance.createEvent(
        res.data._eventMetadataURL,
        res.data._tiers,
        res.data._artists,
        res.data._saleRule,
        res.data._ticketMetadataURL
      );
      await tx.wait(); // Wait for the transaction to be mined
      const result = await eventService.verifyEvent({
        transactionHash: tx.hash,
        eventMetadataUrl: res.data._eventMetadataURL,
      });
      if (result.status === 200) {
        setIsLoading(false);
        resetForm();
        setIsPublished(true);
        toast.success("Your event would be published soon");
      }
    } catch (error) {
      console.error("Error publishing event:", error);
    }
  }, [eventFormData, resetForm]);

  const isLastStep = currentStepIndex === steps.length - 1;
  const { isValid } = methods.formState;

  const hasUnsavedChanges = useMemo(() => {
    return !!(
      eventFormData.coverPhoto ||
      eventFormData.thumbnail ||
      eventFormData.seatMap ||
      eventFormData.previewCoverPhoto ||
      eventFormData.previewSeatMap ||
      eventFormData.previewThumbnail
    );
  }, [eventFormData]);

  const isHaveImages = useMemo(() => {
    if (currentStepIndex === 0) {
      return eventFormData.coverPhoto && eventFormData.thumbnail;
    }
    if (currentStepIndex === 2) {
      return eventFormData.seatMap;
    }
    return true;
  }, [eventFormData, currentStepIndex]);

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-4">
        {isCreationFlow && (
          <NavigationPrompt
            when={hasUnsavedChanges && !isPublished}
            message="You have unsaved changes in your event. If you leave now, your changes may be lost. Are you sure you want to leave?"
            resetImage={resetImage}
            resetForm={resetForm}
          />
        )}
        {isCreationFlow && (
          <Card className="flex items-center justify-between p-3 sticky -top-14 z-10 bg-white dark:bg-gray-900">
            <Button onClick={handleBack} disabled={currentStepIndex === 0}>
              Back
            </Button>

            <StepSection steps={steps} currentStepIndex={currentStepIndex} />

            {isLastStep ? (
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  disabled={!isValid || isPending || !isHaveImages || isLoading}
                  onClick={handleCreateEvent}
                  className="dark:border-gray-700"
                >
                  {isPending ? " Saving..." : "Save as draft"}
                </Button>
                <Button
                  disabled={!isValid || isPending || !isHaveImages || isLoading}
                  onClick={handlePublishEvent}
                >
                  {isLoading ? "Publishing..." : "Publish Event"}
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleContinue}
                disabled={!isValid || !isHaveImages}
              >
                Continue
              </Button>
            )}
          </Card>
        )}
        <Outlet />
      </div>
    </FormProvider>
  );
};

export default EventScreenLayout;
