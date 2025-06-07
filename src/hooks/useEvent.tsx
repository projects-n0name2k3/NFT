//mutation for get event details

import { useQuery } from "@tanstack/react-query";
import { eventService } from "@/services/event";

export const useEvent = (eventId: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => eventService.getEvent(eventId),
    enabled: !!eventId,
    staleTime: 0.5 * 60 * 1000, // 5 minutes
  });

  return {
    event: data,
    isLoading,
    isError,
  };
};
