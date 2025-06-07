import { UpdateImageParams } from "@/common/type";
import apiClient from "../lib/axios";

export const imageService = {
  updateUserImage: async ({
    thumbnailUrl,
    coverPhotoUrl,
    name,
    bio,
    role,
  }: UpdateImageParams) => {
    // Create form data with only the provided image
    const formData = new FormData();

    if (thumbnailUrl) {
      formData.append("thumbnailImage", thumbnailUrl);
    } else if (coverPhotoUrl) {
      formData.append("coverPhotoImage", coverPhotoUrl);
    }

    // Append other fields
    formData.append("name", name || "");
    formData.append("bio", bio || "");

    const endpoint =
      role === "organizer" ? "/organizers/profile" : "/users/profile";
    const response = await apiClient.put(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // Handle response which could have either updatedUser or user property
    return response.data.data.updatedUser || response.data.data.user;
  },
};
