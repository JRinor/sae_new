export const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
  };
  
  export const isSameWeek = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  
  d1.setDate(d1.getDate() - d1.getDay());
  d2.setDate(d2.getDate() - d2.getDay());
  
  return d1.getTime() === d2.getTime();
  };
  
  export const isValidDeliveryDate = (date, holidays, openWeeks) => {
  const isOpenWeek = openWeeks.some(week => 
    isSameWeek(new Date(date), new Date(week))
  );
  
  const isHoliday = holidays.some(holiday => 
    isSameDay(new Date(date), new Date(holiday))
  );
  
  return isOpenWeek && !isHoliday;
  };
  
  export const getNextValidDate = (date, holidays, openWeeks) => {
  let nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);
  
  while (!isValidDeliveryDate(nextDate, holidays, openWeeks)) {
    nextDate.setDate(nextDate.getDate() + 1);
  }
  
  return nextDate;
  };
