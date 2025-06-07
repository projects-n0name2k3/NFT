import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios";
import useUserStore from "@/store/user-store";
import useAuthStore from "@/store/auth-store";
import { useEffect } from "react";
import { User } from "@/common/type";

const fetchUserProfile = async (): Promise<User> => {
  const response = await apiClient.get(`/users/profile`, {
    withCredentials: true,
  });
  return response.data.data.user;
};

export const useUser = () => {
  const { user, setUser } = useUserStore();
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  // Keep the query for initial data loading
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUserProfile,
    enabled: isAuthenticated,
    staleTime: 0.5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Add mutation for updating user data
  const { mutate: updateUserProfile, isPending: isUpdating } = useMutation({
    mutationFn: fetchUserProfile,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["user"] });
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
    isLoading: isLoading || isUpdating,
    error,
    refetchUser: refetch,
    updateUserProfile,
  };
};
