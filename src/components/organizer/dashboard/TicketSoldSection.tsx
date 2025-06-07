import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDarkMode } from "@/contexts/DarkModeContext";

// Define the event type
interface Event {
  eventId: string;
  eventName: string;
  soldQuantity: number;
  totalSupply: number;
}

interface TotalTicketsSectionProps {
  allEventData: Event[];
  selectedEventId?: string;
  setSelectedEventId: (id: string) => void;
}

export default function TotalTicketsSection({
  allEventData,
  selectedEventId,
  setSelectedEventId,
}: TotalTicketsSectionProps) {
  console.log(allEventData);
  const { isDarkMode } = useDarkMode();

  // Filter events based on selection
  const displayedEvents =
    selectedEventId === "all"
      ? allEventData
      : allEventData.filter((event) => event.eventId === selectedEventId);

  // Calculate totals based on displayed events
  const totalSold = displayedEvents.reduce(
    (sum, event) => sum + event.soldQuantity,
    0
  );
  const totalTickets = displayedEvents.reduce(
    (sum, event) => sum + event.totalSupply,
    0
  );
  const totalPercentage =
    totalTickets > 0 ? Math.round((totalSold / totalTickets) * 100) : 0;

  // Colors for the charts
  const chartColors = {
    primary: isDarkMode ? "#3f4865" : "#6366f1",
    secondary: isDarkMode ? "#1e2235" : "#e2e8f0",
    text: isDarkMode ? "#ffffff" : "#1e293b",
    subtext: isDarkMode ? "#94a3b8" : "#64748b",
    background: isDarkMode ? "#0f1420" : "#ffffff",
  };

  // Data for the circular chart
  const circleData = [
    { name: "Sold", value: totalPercentage },
    { name: "Remaining", value: 100 - totalPercentage },
  ];

  // Handle event selection change
  const handleEventChange = (value: string) => {
    setSelectedEventId(value);
  };

  return (
    <Card className=" shadow-md transition-all duration-200">
      <CardHeader>
        <CardTitle>Total Tickets Sold - All Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Circular chart */}
          <div className="w-full md:w-1/4 flex justify-center">
            <div className="relative h-48 w-48">
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <span className="text-4xl font-bold">{totalPercentage}%</span>
                <span className="text-sm text-muted-foreground">
                  {totalSold}/{totalTickets}
                </span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={circleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={70}
                    paddingAngle={0}
                    dataKey="value"
                    strokeWidth={0}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <Cell key="cell-0" fill={chartColors.primary} />
                    <Cell key="cell-1" fill={chartColors.secondary} />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right section with dropdown and progress bars */}
          <div className="w-full md:w-3/4">
            <Select value={selectedEventId} onValueChange={handleEventChange}>
              <SelectTrigger className="w-full mb-6">
                <SelectValue placeholder="All events" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All events</SelectItem>
                {allEventData.map((event) => (
                  <SelectItem key={event.eventId} value={event.eventId}>
                    {event.eventName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="space-y-4">
              {displayedEvents.length > 0 ? (
                displayedEvents.map((event, index) => {
                  const percentage = Math.round(
                    (event.soldQuantity / event.totalSupply) * 100
                  );

                  return (
                    <div key={index} className="space-y-1 border p-4 rounded">
                      <div className="flex justify-between text-sm">
                        <span>{event.eventName}</span>
                        <span>{percentage}%</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full">
                        <div
                          className="h-2 rounded-full transition-all duration-500 ease-in-out"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: chartColors.primary,
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Sold: {event.soldQuantity}/{event.totalSupply}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No events to display
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
