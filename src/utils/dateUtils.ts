import { TimeFilter } from '@/types';

/**
 * Get the start date for a given time filter
 * @param timeFilter The time filter to calculate the start date for
 * @param referenceDate Optional reference date (defaults to today)
 * @returns Start date as ISO string (YYYY-MM-DD)
 */
export function getTimeFilterStartDate(timeFilter: TimeFilter, referenceDate?: Date): string {
  const today = referenceDate || new Date();
  const startDate = new Date(today);
  
  switch (timeFilter) {
    case 'TODAY':
      // For TODAY, start and end are the same (today's date)
      return formatDateToISO(startDate);
    
    case 'LAST WEEK':
      // Last 7 days from today (inclusive)
      startDate.setDate(today.getDate() - 6); // 6 days ago + today = 7 days
      return formatDateToISO(startDate);
    
    case 'LAST MONTH':
      // Last 30 days from today (inclusive)
      startDate.setDate(today.getDate() - 29); // 29 days ago + today = 30 days
      return formatDateToISO(startDate);
    
    case 'LAST YEAR':
      // Last 365 days from today (inclusive)
      startDate.setDate(today.getDate() - 364); // 364 days ago + today = 365 days
      return formatDateToISO(startDate);
    
    default:
      return formatDateToISO(today);
  }
}

/**
 * Get the end date for a given time filter (always today)
 * @param referenceDate Optional reference date (defaults to today)
 * @returns End date as ISO string (YYYY-MM-DD)
 */
export function getTimeFilterEndDate(referenceDate?: Date): string {
  const today = referenceDate || new Date();
  return formatDateToISO(today);
}

/**
 * Check if a content date falls within the specified time filter range
 * @param contentDate The content date string (YYYY-MM-DD)
 * @param timeFilter The time filter to check against
 * @param referenceDate Optional reference date (defaults to today)
 * @returns True if the content date is within the filter range
 */
export function isContentWithinTimeFilter(
  contentDate: string, 
  timeFilter: TimeFilter, 
  referenceDate?: Date
): boolean {
  const startDate = getTimeFilterStartDate(timeFilter, referenceDate);
  const endDate = getTimeFilterEndDate(referenceDate);
  
  // Convert dates to comparable format (YYYY-MM-DD)
  const contentDateFormatted = formatDateToISO(new Date(contentDate));
  
  return contentDateFormatted >= startDate && contentDateFormatted <= endDate;
}

/**
 * Format a Date object to ISO date string (YYYY-MM-DD)
 * @param date The date to format
 * @returns Formatted date string
 */
export function formatDateToISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get a human-readable description of the time filter range
 * @param timeFilter The time filter
 * @param referenceDate Optional reference date (defaults to today)
 * @returns Human-readable description
 */
export function getTimeFilterDescription(timeFilter: TimeFilter, referenceDate?: Date): string {
  const today = referenceDate || new Date();
  const startDate = getTimeFilterStartDate(timeFilter, referenceDate);
  const endDate = getTimeFilterEndDate(referenceDate);
  
  switch (timeFilter) {
    case 'TODAY':
      return `Content from ${formatDateForHuman(today)}`;
    
    case 'LAST WEEK':
      return `Content from the last 7 days (${formatDateForHuman(new Date(startDate))} - ${formatDateForHuman(today)})`;
    
    case 'LAST MONTH':
      return `Content from the last 30 days (${formatDateForHuman(new Date(startDate))} - ${formatDateForHuman(today)})`;
    
    case 'LAST YEAR':
      return `Content from the last 365 days (${formatDateForHuman(new Date(startDate))} - ${formatDateForHuman(today)})`;
    
    default:
      return 'All content';
  }
}

/**
 * Format a date for human readability
 * @param date The date to format
 * @returns Human-readable date string
 */
export function formatDateForHuman(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Generate a date string for synthetic content that falls within a specific time filter
 * @param timeFilter The time filter the content should fall within
 * @param daysOffset Optional offset within the range (0 = most recent, max = oldest)
 * @param referenceDate Optional reference date (defaults to today)
 * @returns Date string in YYYY-MM-DD format
 */
export function generateContentDateForFilter(
  timeFilter: TimeFilter, 
  daysOffset: number = 0, 
  referenceDate?: Date
): string {
  const today = referenceDate || new Date();
  const contentDate = new Date(today);
  
  switch (timeFilter) {
    case 'TODAY':
      // Content from today only
      return formatDateToISO(contentDate);
    
    case 'LAST WEEK':
      // Content from 0-6 days ago
      const weekOffset = Math.min(Math.max(daysOffset, 0), 6);
      contentDate.setDate(today.getDate() - weekOffset);
      return formatDateToISO(contentDate);
    
    case 'LAST MONTH':
      // Content from 0-29 days ago
      const monthOffset = Math.min(Math.max(daysOffset, 0), 29);
      contentDate.setDate(today.getDate() - monthOffset);
      return formatDateToISO(contentDate);
    
    case 'LAST YEAR':
      // Content from 0-364 days ago
      const yearOffset = Math.min(Math.max(daysOffset, 0), 364);
      contentDate.setDate(today.getDate() - yearOffset);
      return formatDateToISO(contentDate);
    
    default:
      return formatDateToISO(contentDate);
  }
}

/**
 * Get debug information about date filtering
 * @param timeFilter The time filter
 * @param referenceDate Optional reference date
 * @returns Debug information object
 */
export function getDateFilterDebugInfo(timeFilter: TimeFilter, referenceDate?: Date) {
  const today = referenceDate || new Date();
  const startDate = getTimeFilterStartDate(timeFilter, referenceDate);
  const endDate = getTimeFilterEndDate(referenceDate);
  
  return {
    timeFilter,
    referenceDate: formatDateToISO(today),
    startDate,
    endDate,
    dayRange: timeFilter === 'TODAY' ? 1 : 
              timeFilter === 'LAST WEEK' ? 7 :
              timeFilter === 'LAST MONTH' ? 30 : 365,
    description: getTimeFilterDescription(timeFilter, referenceDate)
  };
} 