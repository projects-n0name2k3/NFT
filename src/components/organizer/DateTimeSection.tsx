import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useEventFormStore } from "@/store/event-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

interface DateTimeSectionProps {
  title: string;
  date: Date | string | null;
  time?: string;
  dateField: string;
  timeField?: string;
  updateField?: (name: string, value: string) => void;
  handleTimeChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DateTimeSection = ({
  title,
  date,
  time,
  dateField,
  timeField,
  handleTimeChange,
  updateField,
}: DateTimeSectionProps) => {
  const { eventStartDate, eventEndDate, eventEndTime, eventStartTime } =
    useEventFormStore();
  const handleUpdateDate = (date: Date | undefined) => {
    if (date) {
      if (dateField === "eventStartDate") {
        if (eventEndDate && new Date(eventEndDate) < date) {
          toast.error("Event start date cannot be after the end date");

          return;
        }
      }
      if (dateField === "eventEndDate") {
        if (eventStartDate && new Date(eventStartDate) > date) {
          toast.error("Event end date cannot be before the start date");
          return;
        }
        if (date <= new Date(eventStartDate)) {
          if (eventStartTime >= eventEndTime) {
            toast.error("Event end date cannot be before the start date");
            return;
          }
        }
      }

      if (updateField) {
        updateField(dateField, date.toISOString());
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="start-date" className="text-sm text-muted-foreground">
          {title}
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              onSelect={(date) => handleUpdateDate(date)}
              fromDate={
                dateField === "eventEndDate"
                  ? new Date(eventStartDate)
                  : new Date()
              }
            />
          </PopoverContent>
        </Popover>
      </div>
      {timeField && (
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="start-time" className="text-sm text-muted-foreground">
            Time
          </Label>
          <Input
            type="time"
            value={time}
            name={timeField}
            onChange={handleTimeChange}
            className="w-full "
          />
        </div>
      )}
    </div>
  );
};

export default DateTimeSection;
