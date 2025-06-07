import { EventDetails } from "@/common/type";
import apiClient from "../lib/axios";

export const marketplaceService = {
  getMarketplaceEventDetail: async (eventId: string): Promise<EventDetails> => {
    const response = await apiClient.get(`/marketplace/${eventId}`);
    return response.data.data.event;
  },
};
