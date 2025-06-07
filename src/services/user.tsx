import apiClient from "../lib/axios";

export const userService = {
  getProfile: async () => {
    const response = await apiClient.get("/users/profile", {
      withCredentials: true,
    });
    return response.data.data.user;
  },

  updateName: async (name: string) => {
    const response = await apiClient.put("/users/profile", { name });
    return response.data;
  },
};
