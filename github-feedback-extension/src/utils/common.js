import { format, addDays } from "date-fns";

// using to add days in selected date
export const addCustomDays = (selectedDate, dateFormat, addDaysCount) => {
  let startDate = format(new Date(selectedDate), dateFormat);
  let endDate = format(
    addDays(new Date(selectedDate), addDaysCount),
    dateFormat
  );
  return {
    startDate,
    endDate,
  };
};
