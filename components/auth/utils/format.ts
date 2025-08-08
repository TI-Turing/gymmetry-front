export const formatDateToDisplay = (date: Date): string => {
  if (!date || isNaN(date.getTime())) {
    return '';
  }

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const formatDateForBackend = (dateString: string): string => {
  if (!dateString) {
    return '';
  }

  const parts = dateString.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    if (day && month && year) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  }

  return dateString;
};

export const parseDisplayDate = (dateString: string): Date => {
  if (!dateString) {
    return new Date();
  }

  const parts = dateString.split('/');
  if (parts.length === 3) {
    const dayStr = parts[0];
    const monthStr = parts[1];
    const yearStr = parts[2];
    if (dayStr && monthStr && yearStr) {
      const day = parseInt(dayStr, 10);
      const month = parseInt(monthStr, 10) - 1;
      const year = parseInt(yearStr, 10);

      const date = new Date(year, month, day);
      return isNaN(date.getTime()) ? new Date() : date;
    }
  }

  return new Date();
};

export const formatDate = formatDateToDisplay;
export const parseDate = parseDisplayDate;

/**
 * Formatea un número de teléfono
 */
export const formatPhoneNumber = (dialCode: string, phone: string): string => {
  return `${dialCode}${phone}`.trim();
};

/**
 * Capitaliza la primera letra de cada palabra
 */
export const capitalizeWords = (text: string): string => {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
