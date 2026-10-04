const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatWritingDate(date: string): string {
  const iso = date.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/);
  if (iso) {
    const year = iso[1];
    const month = months[Number(iso[2]) - 1];
    const day = iso[3] ? String(Number(iso[3])) : undefined;
    if (!month) {
      return date;
    }
    return day ? `${month} ${day}, ${year}` : `${month} ${year}`;
  }
  return date;
}
