import api from "@/lib/axios";

export const ticketService = {
  getTickets: async (ticketId: string) => {
    const response = await api.get(`/tickets/${ticketId}`);
    return response.data.data.ticketTier;
  },
};
