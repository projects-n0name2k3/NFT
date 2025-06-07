import apiClient from "../lib/axios";

export const dashboardService = {
  getStatisticsData: async ({
    selectedRange,
    dateFrom,
    dateTo,
  }: {
    selectedRange: "week" | "month" | "custom";
    dateFrom?: string;
    dateTo?: string;
  }) => {
    const response = await apiClient.get(
      `/tickets/chart?type=${selectedRange}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  },

  getTicketsSoldStats: async (eventId?: string) => {
    const response = await apiClient.get(
      eventId !== "all" ? `/tickets/sold/${eventId}` : "/tickets/sold",
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  },
};
