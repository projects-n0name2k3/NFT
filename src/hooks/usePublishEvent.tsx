/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation } from "@tanstack/react-query";
import { eventService } from "@/services/event";
import { toast } from "sonner";
import { useEventFormStore } from "@/store/event-form";
import { useNavigate } from "react-router";

export const usePublishEvent = () => {
  const { resetForm } = useEventFormStore();
  const navigate = useNavigate();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data: FormData) => eventService.pubishEvent(data),
    onSuccess: async (res) => {
      navigate(`/organizer/events`);
      toast.success(res.message);
      resetForm();
    },
    onError: () => {
      toast.error("Failed to save event");
    },
  });

  return {
    publishEvent: mutate,
    isPending,
    isSuccess,
  };
};
