import { eventService } from "@/services/event";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteDraft = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (eventId: string) => eventService.deleteDraft(eventId),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return {
    deleteDraft: mutate,
    isPending,
  };
};
