import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { validateTime } from "@/utils/validateTicketSaleTime";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

interface SaleTimeCardProps {
  ticketStartDate: string;
  ticketStartTime: string;
  ticketEndDate: string;
  ticketEndTime: string;
  eventStartDate: string;
  eventEndDate: string;
  updateField: (field: string, value: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SaleTimeCard = ({
  ticketStartDate,
  ticketStartTime,
  ticketEndDate,
  ticketEndTime,
  eventStartDate,
  eventEndDate,
  updateField,
  handleInputChange,
}: SaleTimeCardProps) => {
  const [date, setDate] = useState<Date>();
  return (
    <Card className="shadow">
      <CardHeader>
        <CardTitle>Sale times</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <Label
                htmlFor="start-date"
                className="text-sm text-muted-foreground"
              >
                Start date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full sm:w-[200px] lg:w-[280px] justify-start text-left font-normal",
                      !ticketStartDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {ticketStartDate ? (
                      format(ticketStartDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    fromDate={new Date()}
                    toDate={new Date(eventStartDate)}
                    onSelect={(date) => {
                      setDate(date);
                      if (date) {
                        updateField("ticketStartDate", date.toISOString());
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <Label
                htmlFor="sale-start-time"
                className="text-sm text-muted-foreground"
              >
                Time
              </Label>
              <Input
                id="sale-start-time"
                name="ticketStartTime"
                value={ticketStartTime}
                type="time"
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <Label
                htmlFor="start-date"
                className="text-sm text-muted-foreground"
              >
                End date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full sm:w-[200px] lg:w-[280px] justify-start text-left font-normal",
                      !ticketEndDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {ticketEndDate ? (
                      format(ticketEndDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    fromDate={new Date(ticketStartDate)}
                    toDate={new Date(eventStartDate)}
                    onSelect={(date) => {
                      setDate(date);
                      if (date) {
                        if (
                          validateTime(
                            date,
                            eventStartDate,
                            eventEndDate,
                            ticketStartDate,
                            ticketEndDate
                          )
                        ) {
                          updateField("ticketEndDate", date.toISOString());
                        }
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <Label
                htmlFor="sale-end-time"
                className="text-sm text-muted-foreground"
              >
                Time
              </Label>
              <Input
                id="sale-end-time"
                name="ticketEndTime"
                value={ticketEndTime}
                type="time"
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SaleTimeCard;
