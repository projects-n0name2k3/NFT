export const combineDate = (date: string, time: string) => {
  const dateObj = new Date(date);

  // Split time string (expected format "HH:MM" or "HH:MM:SS")
  const [hours, minutes] = time.split(":").map(Number);

  // Set hours and minutes directly
  dateObj.setHours(hours, minutes);

  return dateObj;
};
