import { OrganizerProfile } from "@/common/type";
import apiClient from "../lib/axios";

export const organizerService = {
  getProfile: async () => {
    const response = await apiClient.get("/organizers/profile", {
      withCredentials: true,
    });
    return response.data.data.user;
  },

  updateProfile: async (data: OrganizerProfile) => {
    const response = await apiClient.put("/organizers/profile", { ...data });
    return response.data;
  },
};
