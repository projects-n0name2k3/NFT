import { toast } from "sonner";

const validateTime = (
  date: Date,
  eventStartDate: string,
  eventEndDate: string,
  ticketStartDate: string,
  ticketEndDate: string
) => {
  if (!eventStartDate || !eventEndDate) {
    toast.error("Please select start and end date first");
    return false;
  }
  if (eventStartDate === eventEndDate) {
    if (date.toISOString() > new Date(eventEndDate).toISOString()) {
      toast.error("Please check infomation again");
      return false;
    }
  }
  if (!ticketStartDate) {
    toast.error("Please select start date first");
    return false;
  }
  if (ticketStartDate === ticketEndDate) {
    if (date.toISOString() < new Date(ticketStartDate).toISOString()) {
      toast.error("Please check infomation again");
      return false;
    }
  }
  return true;
};

export { validateTime };
