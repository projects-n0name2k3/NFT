import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios";
import useUserStore from "@/store/user-store";
import useAuthStore from "@/store/auth-store";
import { useEffect } from "react";
import { OrganizerProfile, User } from "@/common/type";
import { organizerService } from "@/services/organizer";
import { toast } from "sonner";

const fetchOrganizerProfile = async (): Promise<User> => {
  const response = await apiClient.get(`/organizers/profile`, {
    withCredentials: true,
  });
  return response.data.data.user;
};

export const useOrganizer = () => {
  const { user, setUser } = useUserStore();
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  //get organizer profile if user is an organizer
  const {
    data,
    error,
    refetch,
    isPending: isGetting,
  } = useQuery({
    queryKey: ["organizer"],
    queryFn: fetchOrganizerProfile,
    enabled: isAuthenticated,
    staleTime: 0.5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Add mutation for updating organizer data
  const { mutate, isPending } = useMutation({
    mutationFn: (data: OrganizerProfile) =>
      organizerService.updateProfile(data),
    onSuccess: (data) => {
      console.log(data);
      toast.success(data.message);
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["organizer"] });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  // Only update user state when data changes
  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  return {
    user: data || user,
    isLoading: isPending,
    isGetting,
    error,
    updateProfile: mutate,
    refetchOrganizer: refetch,
  };
};
