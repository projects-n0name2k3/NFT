import { dashboardService } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";

export const useGetTicketsSoldStats = (eventId?: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["ticketsSoldStats"],
    queryFn: () => dashboardService.getTicketsSoldStats(eventId),
    staleTime: 0.5 * 60 * 1000, // 5 minutes
  });
  return {
    data,
    isLoading,
    isError,
  };
};
