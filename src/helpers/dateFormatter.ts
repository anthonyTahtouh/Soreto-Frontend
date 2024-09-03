import moment from "moment";

export const formatDate = (date: string) => {
  const dateFormat = new Date(date);
  return dateFormat.toLocaleDateString('en-GB', {
    timeZone: 'UTC',
  });
};

export const formatDateWithTime = (date: string) => {
  const dateFormat = new Date(date);
  return `${dateFormat.toLocaleDateString('en-GB', {
    timeZone: 'UTC',
  })} ${dateFormat.toLocaleTimeString('en-GB', {
    timeZone: 'UTC',
  })}`;
};

export const formatDateMinutes = (date: string) => {
  const dateFormat = new Date(date);
  const day = dateFormat.toLocaleDateString('en-GB', { timeZone: 'UTC' }); // dd/mm/yyyy
  const minutes = new Date(date).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  });

  return `${day} ${minutes}`;
};

export const timezoneOffsetOut = (dateString: any) => {
  const dateIn = new Date(dateString);
  dateIn.setTime(dateIn.getTime() + dateIn.getTimezoneOffset() * 60 * 1000);
  return dateIn;
};

export const timezoneOffsetIn = (dateString: any) => {
  const dateIn = new Date(dateString);
  dateIn.setTime(dateIn.getTime() - dateIn.getTimezoneOffset() * 60 * 1000);
  return dateIn;
};


export const getMiddleDay = (date1: any, date2: any) => {
  // Parse the input dates using moment
  const start = moment(date1);
  const end = moment(date2);

  // Calculate the difference in days between the two dates
  const diffInDays = end.diff(start, 'days');

  // Calculate the middle day index
  // If the number of days is even, round up
  const middleDayIndex = Math.ceil(diffInDays / 2);

  // Add the middle day index to the start date to get the middle day
  const middleDay = start.add(middleDayIndex, 'days');

  return middleDay;
}
