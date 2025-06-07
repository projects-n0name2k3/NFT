import DateTimeSection from "@/components/organizer/DateTimeSection";

interface EventPeriodComponentProps {
  eventStartDate: string;
  eventStartTime?: string;
  eventEndDate: string;
  eventEndTime?: string;
  updateField: (field: string, value: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EventPeriodComponent = ({
  eventStartDate,
  eventStartTime,
  eventEndDate,
  eventEndTime,
  updateField,
  handleInputChange,
}: EventPeriodComponentProps) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
      <DateTimeSection
        title="Start date"
        date={eventStartDate}
        time={eventStartTime}
        dateField="eventStartDate"
        timeField={eventStartTime ? "eventStartTime" : undefined}
        updateField={updateField}
        handleTimeChange={eventStartTime ? handleInputChange : undefined}
      />
      <DateTimeSection
        title="End date"
        date={eventEndDate}
        time={eventEndTime}
        dateField="eventEndDate"
        timeField={eventEndTime ? "eventEndTime" : undefined}
        updateField={updateField}
        handleTimeChange={eventEndTime ? handleInputChange : undefined}
      />
    </div>
  );
};

export default EventPeriodComponent;
