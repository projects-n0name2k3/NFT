import { dashboardService } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";

export const useGetStatisticsData = ({
  selectedRange,
  dateFrom,
  dateTo,
}: {
  selectedRange: "week" | "month" | "custom";
  dateFrom?: string;
  dateTo?: string;
}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["statistic", selectedRange, dateFrom, dateTo],
    queryFn: () =>
      dashboardService.getStatisticsData({
        selectedRange,
        dateFrom,
        dateTo,
      }),
    staleTime: 0.5 * 60 * 1000, // 30 seconds
  });
  return {
    data,
    isLoading,
    isError,
  };
};
