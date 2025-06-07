//write useSaveEvent hook use tanstack query here

import { useMutation } from "@tanstack/react-query";
import { eventService } from "@/services/event";
import { toast } from "sonner";
import { useEventFormStore } from "@/store/event-form";
import { useNavigate } from "react-router";

export const useSaveEvent = () => {
  const { resetForm } = useEventFormStore();
  const navigate = useNavigate();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data: FormData) => eventService.saveEvent(data),
    onSuccess: (res) => {
      navigate(`/organizer/events`);
      toast.success(res.message);
      resetForm();
    },
    onError: () => {
      toast.error("Failed to save event");
    },
  });

  return {
    saveEvent: mutate,
    isPending,
    isSuccess,
  };
};
