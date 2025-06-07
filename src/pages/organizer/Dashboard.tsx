/* eslint-disable @typescript-eslint/no-explicit-any */

import StatCard from "@/components/organizer/dashboard/StatCard";
import TotalTicketsSection from "@/components/organizer/dashboard/TicketSoldSection";
import { Button } from "@/components/ui/button";
import { useDarkMode } from "@/contexts/DarkModeContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import { useGetStatisticsData } from "@/hooks/useGetStatisticsData";
import { useGetTicketsSoldStats } from "@/hooks/useGetTicketsSoldStats";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { isDarkMode } = useDarkMode();
  const [selectedRange, setSelectedRange] = useState<
    "week" | "month" | "custom"
  >("week");
  const [dateFrom, setDateFrom] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dateTo, setDateTo] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string>("all");

  const { data, isLoading } = useGetStatisticsData({
    selectedRange,
    dateFrom,
    dateTo,
  });

  const { data: ticketsData, isLoading: isGetting } =
    useGetTicketsSoldStats(selectedEventId);

  return (
    <div className="flex flex-col gap-5 w-full h-full p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Dashboard
        </h1>
        <div className="flex items-center gap-2">
          {["week", "month", "custom"].map((range) => (
            <Button
              key={range}
              variant={selectedRange === range ? "default" : "outline"}
              size="sm"
              className="text-sm font-medium capitalize"
              onClick={() =>
                setSelectedRange(range as "week" | "month" | "custom")
              }
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="w-full p-4 md:p-6 bg-white rounded-xl shadow-sm dark:bg-gray-800 transition-all">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array(3)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border dark:border-gray-700"
                  >
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-32 mb-1" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))
            : data?.stat.map((stat: any, index: number) => (
                <StatCard key={index} stat={{ ...stat, type: selectedRange }} />
              ))}
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-sm transition-all flex flex-col">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          {selectedRange === "custom"
            ? `Revenue Overview From ${dateFrom || "____"} to ${
                dateTo || "____"
              }`
            : `Revenue Overview This ${
                selectedRange.charAt(0).toUpperCase() + selectedRange.slice(1)
              }`}
        </h2>

        {selectedRange === "custom" && (
          <div className="flex gap-2 mb-4">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm dark:bg-gray-900 dark:text-white"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm dark:bg-gray-900 dark:text-white"
            />
          </div>
        )}

        {isLoading ? (
          <div className="h-[350px] w-full flex items-center justify-center">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350} className="mt-2">
            <LineChart
              key={selectedRange} // force re-render on mode or range change
              data={data?.revenueBreakdown}
              margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={
                  isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                }
              />
              <XAxis
                dataKey="label"
                tick={{ fill: isDarkMode ? "#cbd5e1" : "#64748b" }}
                axisLine={{ stroke: isDarkMode ? "#475569" : "#cbd5e1" }}
                style={{ fontSize: "0.75rem" }}
              />
              <YAxis
                tick={{ fill: isDarkMode ? "#cbd5e1" : "#64748b" }}
                axisLine={{ stroke: isDarkMode ? "#475569" : "#cbd5e1" }}
                style={{ fontSize: "0.75rem" }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#1e293b" : "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  color: isDarkMode ? "#f8fafc" : "#334155",
                  padding: "0.75rem",
                }}
                formatter={(value) => [`$${value}`]}
              />
              <Legend wrapperStyle={{ paddingTop: "1rem" }} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                name="Revenue"
                dot={{
                  stroke: "#8b5cf6",
                  strokeWidth: 2,
                  r: 4,
                  fill: isDarkMode ? "#1e293b" : "white",
                }}
                activeDot={{ r: 7, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Ticket Sales Section */}
      <section className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-sm transition-all">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Ticket Sales
        </h2>
        {isGetting ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full max-w-sm mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>
          </div>
        ) : ticketsData ? (
          <TotalTicketsSection
            allEventData={ticketsData}
            selectedEventId={selectedEventId}
            setSelectedEventId={setSelectedEventId}
          />
        ) : null}
      </section>
    </div>
  );
};

export default Dashboard;
