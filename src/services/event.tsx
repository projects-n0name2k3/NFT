import { EventDetails } from "@/common/type";
import apiClient from "../lib/axios";

export const eventService = {
  saveEvent: async (formData: FormData) => {
    const response = await apiClient.post("/events/save/draft", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  pubishEvent: async (formData: FormData) => {
    const response = await apiClient.post("/events/publish", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  verifyEvent: async ({
    transactionHash,
    eventMetadataUrl,
  }: {
    transactionHash: string;
    eventMetadataUrl: string;
  }) => {
    const response = await apiClient.post("/events/status", {
      transactionHash,
      eventMetadataUrl,
    });
    return response.data;
  },
  getEvent: async (eventId: string): Promise<EventDetails> => {
    const response = await apiClient.get(`/events/${eventId}`);
    return response.data.data.event;
  },

  deleteDraft: async (eventId: string) => {
    const response = await apiClient.delete(`/events/draft/${eventId}`);
    return response.data;
  },
};
