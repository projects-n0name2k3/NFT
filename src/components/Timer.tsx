import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TimerProps {
  startTime?: string;
  endTime: string;
  light?: boolean;
}

export default function Timer({
  endTime,
  light = false,
  startTime,
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endTime).getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    // Cleanup
    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="space-y-2">
      <h3 className={cn("font-medium text-center", light && "text-white")}>
        {startTime && new Date(startTime).getTime() > new Date().getTime()
          ? "Time until event starts"
          : "Sale ends in:"}
      </h3>
      <div className="grid grid-cols-4 gap-2">
        <TimeUnit value={timeLeft.days} label="Days" light={light} />
        <TimeUnit value={timeLeft.hours} label="Hours" light={light} />
        <TimeUnit value={timeLeft.minutes} label="Minutes" light={light} />
        <TimeUnit value={timeLeft.seconds} label="Seconds" light={light} />
      </div>
    </div>
  );
}

function TimeUnit({
  value,
  label,
  light = false,
}: {
  value: number;
  label: string;
  light?: boolean;
}) {
  return (
    <Card className={cn(light && "bg-black/50 border-gray-700")}>
      <CardContent className="p-2 text-center">
        <div className={cn("text-2xl font-bold", light && "text-white")}>
          {value}
        </div>
        <div
          className={cn(
            "text-xs text-muted-foreground",
            light && "text-gray-300"
          )}
        >
          {label}
        </div>
      </CardContent>
    </Card>
  );
}
