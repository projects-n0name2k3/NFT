import { useMutation, useQueryClient } from "@tanstack/react-query";

import useUserStore from "@/store/user-store";
import { userService } from "@/services/user";
import { toast } from "sonner";

export const useUpdateName = () => {
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (name: string) => userService.updateName(name),
    onSuccess: (data) => {
      // Update the user in the store
      setUser(data.data.updatedUser);
      toast.success(data.message);
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return {
    updateName: mutate,
    isUpdating: isPending,
    error,
  };
};
