/**
 * Formats date for display (DD/MM/YYYY)
 */
export const formatDateToDisplay = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return '';
  }

  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear().toString();

  return `${day}/${month}/${year}`;
};

/**
 * Formats date for backend (YYYY-MM-DD)
 */
export const formatDateForBackend = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return '';
  }

  const year = dateObj.getFullYear().toString();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Parses display date (DD/MM/YYYY) to Date object
 */
export const parseDisplayDate = (dateString: string): Date | null => {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }

  const parts = dateString.split('/');
  if (parts.length !== 3) {
    return null;
  }

  const dayStr = parts[0];
  const monthStr = parts[1];
  const yearStr = parts[2];

  if (!dayStr || !monthStr || !yearStr) {
    return null;
  }

  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10) - 1; // Month is 0-indexed
  const year = parseInt(yearStr, 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return null;
  }

  const date = new Date(year, month, day);

  // Validate that the date is correct
  if (
    date.getDate() !== day ||
    date.getMonth() !== month ||
    date.getFullYear() !== year
  ) {
    return null;
  }

  return date;
};

/**
 * Formats phone number for display (+XX XXXXXXXXX)
 */
export const formatPhoneDisplay = (
  phone: string,
  countryCode: string = ''
): string => {
  if (!phone) {
    return '';
  }

  const cleanPhone = phone.replace(/\D/g, '');

  if (countryCode && !phone.startsWith('+')) {
    return `+${countryCode} ${cleanPhone}`;
  }

  return cleanPhone;
};

/**
 * Formats phone number for backend (only numbers)
 */
export const formatPhoneForBackend = (phone: string): string => {
  if (!phone) {
    return '';
  }

  return phone.replace(/\D/g, '');
};

/**
 * Capitalizes first letter of each word
 */
export const capitalizeWords = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Capitalizes first letter only
 */
export const capitalizeFirst = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Formats file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) {
    return '0 Bytes';
  }

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Formats currency (Colombian Pesos)
 */
export const formatCurrency = (amount: number): string => {
  if (isNaN(amount)) {
    return '$0';
  }

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats number with thousands separators
 */
export const formatNumber = (number: number): string => {
  if (isNaN(number)) {
    return '0';
  }

  return new Intl.NumberFormat('es-CO').format(number);
};

/**
 * Formats percentage
 */
export const formatPercentage = (
  value: number,
  decimals: number = 1
): string => {
  if (isNaN(value)) {
    return '0%';
  }

  return `${value.toFixed(decimals)}%`;
};

/**
 * Truncates text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength - 3) + '...';
};

/**
 * Formats time ago (e.g., "2 hours ago")
 */
export const formatTimeAgo = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return '';
  }

  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return 'Hace unos segundos';
  } else if (diffMinutes < 60) {
    return `Hace ${diffMinutes} minuto${diffMinutes !== 1 ? 's' : ''}`;
  } else if (diffHours < 24) {
    return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
  } else if (diffDays < 7) {
    return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
  } else {
    return formatDateToDisplay(dateObj);
  }
};

/**
 * Removes accents from text
 */
export const removeAccents = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

/**
 * Slugify text for URLs
 */
export const slugify = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return removeAccents(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default {
  formatDateToDisplay,
  formatDateForBackend,
  parseDisplayDate,
  formatPhoneDisplay,
  formatPhoneForBackend,
  capitalizeWords,
  capitalizeFirst,
  formatFileSize,
  formatCurrency,
  formatNumber,
  formatPercentage,
  truncateText,
  formatTimeAgo,
  removeAccents,
  slugify,
};
