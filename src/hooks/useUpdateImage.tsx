import { useMutation } from "@tanstack/react-query";

import useUserStore from "@/store/user-store";
import { imageService } from "@/services/image";
import { UpdateImageParams } from "@/common/type";
import { toast } from "sonner";

export const useUpdateImage = () => {
  const { setUser } = useUserStore();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (imageData: UpdateImageParams) =>
      imageService.updateUserImage({
        ...imageData,
      }),
    onSuccess: (updatedUser) => {
      toast.success("Image updated successfully");
      setUser(updatedUser);
    },
  });

  return {
    updateImage: mutate,
    isPending,
    error,
  };
};
