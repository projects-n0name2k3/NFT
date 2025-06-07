import { EventFormState } from "@/common/type";
import { combineDate } from "@/utils/combineDate";

export const formMaker = (data: EventFormState) => {
  const formData = new FormData();
  // Basic event details
  formData.append("name", data.name);
  // Combine event start date and time
  const startDate = new Date(data.eventStartDate);
  const [startHours, startMinutes] = data.eventStartTime.split(":").map(Number);
  startDate.setHours(startHours, startMinutes);
  const endDate = new Date(data.eventEndDate);
  const [endHours, endMinutes] = data.eventEndTime.split(":").map(Number);
  startDate.setHours(startHours, startMinutes);
  endDate.setHours(endHours, endMinutes);
  formData.append("eventStartDate", startDate.toISOString());
  formData.append("eventEndDate", endDate.toISOString());
  formData.append(
    "location",
    `${data.location.name} ${data.location.latitude} ${data.location.longitude}`
  );
  formData.append("venue", data.venue);

  // Optional fields
  if (data.description) formData.append("description", data.description);
  if (data.thumbnail) formData.append("thumbnailFile", data.thumbnail);
  if (data.seatMap) formData.append("seatmapFile", data.seatMap);
  if (data.coverPhoto) formData.append("coverPhotoFile", data.coverPhoto);

  const startSaleDate = combineDate(data.ticketStartDate, data.ticketStartTime);
  const endSaleDate = combineDate(data.ticketEndDate, data.ticketEndTime);

  formData.append("sellStartDate", startSaleDate.toISOString());
  formData.append("sellEndDate", endSaleDate.toISOString());
  formData.append("artistClasses", JSON.stringify(data.artistClasses));
  formData.append("ticketTiers", JSON.stringify(data.tiers));
  formData.append("maxPerUser", data.maxTicketPerWallet.toString());

  return formData;
};
