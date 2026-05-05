export const formatTransactionDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const startOfThisYear = new Date(now.getFullYear(), 0, 1);

  if (d >= startOfToday) {
    // Today — show time only
    return `Today ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  if (d >= startOfYesterday) {
    return 'Yesterday';
  }
  if (d >= startOfThisYear) {
    // Same year — show day + month
    return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
  }
  // Different year
  return d.toLocaleDateString([], {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};
