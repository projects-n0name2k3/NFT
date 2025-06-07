import { ticketService } from "@/services/ticket";
import { useQuery } from "@tanstack/react-query";

export const useGetTicket = (ticketId: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: () => ticketService.getTickets(ticketId),
    enabled: !!ticketId,
    staleTime: 0.5 * 60 * 1000, // 5 minutes
  });
  return {
    ticket: data,
    isGettingTicket: isLoading,
    isTicketError: isError,
  };
};
