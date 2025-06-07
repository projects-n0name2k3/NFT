//mutation for get event details

import { useQuery } from "@tanstack/react-query";
import { marketplaceService } from "@/services/marketplace";

export const useMarketplace = (eventId: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["marketplace", eventId],
    queryFn: () => marketplaceService.getMarketplaceEventDetail(eventId),
    enabled: !!eventId,
    staleTime: 0.5 * 60 * 1000, // 5 minutes
  });

  return {
    event: data,
    isLoading,
    isError,
  };
};
