function getOrdinal(n: number) {
  if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;

  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

function formatDateRange(startDate: Date, endDate: Date) {
  const startDay = getOrdinal(startDate.getDate());
  const endDay = getOrdinal(endDate.getDate());

  const month = startDate.toLocaleString('en-GB', { month: 'long' });
  const year = startDate.getFullYear();

  return `${startDay} - ${endDay} ${month} ${year}`;
}

export default formatDateRange;
