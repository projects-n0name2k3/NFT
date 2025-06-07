import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";

const StatCard = ({
  stat,
}: {
  stat: {
    title: string;
    value: string;
    change: number;
    type: "week" | "month" | "custom";
  };
}) => {
  return (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {stat.title}
        </CardTitle>
        <div className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p
              className={`flex flex-row items-center text-sm gap-1 mt-3 ${
                stat.change > 0
                  ? "text-green-500"
                  : stat.change < 0
                  ? "text-red-500"
                  : "text-muted-foreground"
              }`}
            >
              {stat.change > 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : stat.change < 0 ? (
                <TrendingDown className="h-4 w-4 " />
              ) : (
                ""
              )}
              <span>{stat.change}%</span>
            </p>
            <p className="text-xs text-gray-400">
              {stat.type === "week"
                ? "Compared to last week"
                : "Compared to last month"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
