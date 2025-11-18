/**
 * Utility functions for date conversion between different formats
 * Needed for badge service compatibility and form handling
 */

/**
 * Converts a date string (YYYY-MM-DD) to Date object
 * Ensures the date is interpreted as local timezone to avoid timezone shifts
 */
export function stringToDate(
  dateString: string | null | undefined
): Date | null {
  if (!dateString || typeof dateString !== 'string') return null;

  // Parse the date string manually to avoid timezone issues
  const dateParts = dateString.split('-');
  if (dateParts.length !== 3) {
    // Fallback to regular Date parsing
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  }

  const year = parseInt(dateParts[0]);
  const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed
  const day = parseInt(dateParts[2]);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return null;
  }

  // Create date in local timezone
  const date = new Date(year, month, day);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Converts Date object to string format (YYYY-MM-DD)
 */
export function dateToString(
  date: Date | string | number | null | undefined
): string {
  if (!date) return '';

  let validDate: Date;

  // Handle different input types
  if (date instanceof Date) {
    validDate = date;
  } else if (typeof date === 'number') {
    validDate = new Date(date);
  } else if (typeof date === 'string') {
    validDate = new Date(date);
  } else {
    return '';
  }

  // Validate that we have a valid Date
  if (isNaN(validDate.getTime())) {
    return '';
  }

  const year = validDate.getFullYear();
  const month = String(validDate.getMonth() + 1).padStart(2, '0');
  const day = String(validDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Converts timestamp number to Date object
 */
export function timestampToDate(
  timestamp: number | string | null | undefined
): Date | null {
  if (!timestamp) return null;

  let validTimestamp: number;

  if (typeof timestamp === 'string') {
    validTimestamp = parseInt(timestamp);
  } else {
    validTimestamp = timestamp;
  }

  if (isNaN(validTimestamp) || validTimestamp <= 0) {
    return null;
  }

  const date = new Date(validTimestamp);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Converts Date object to timestamp number
 */
export function dateToTimestamp(date: Date): number {
  if (!date) return 0;

  return date.getTime();
}

/**
 * Converts form date string to IPlayer-compatible format
 * Ensures consistent timezone handling
 */
export function formDateToPlayerDate(formDate: string): {
  dateBirth: Date | null;
  fechaNacimiento: number;
} {
  console.log('formDateToPlayerDate - input formDate:', formDate);
  const date = stringToDate(formDate);
  console.log('formDateToPlayerDate - converted date:', date);
  console.log('formDateToPlayerDate - timestamp:', date ? date.getTime() : 0);

  return {
    dateBirth: date,
    fechaNacimiento: date ? date.getTime() : 0,
  };
}

/**
 * Converts IPlayer date fields to form-compatible string
 */
export function playerDateToFormDate(player: {
  dateBirth?: Date | string | number | null;
  fechaNacimiento?: number | string;
}): string {
  console.log('playerDateToFormDate - input player:', player);
  console.log('playerDateToFormDate - dateBirth:', player.dateBirth);
  console.log(
    'playerDateToFormDate - fechaNacimiento:',
    player.fechaNacimiento
  );

  // Try dateBirth first (can be Date, string, or timestamp)
  if (player.dateBirth) {
    const result = dateToString(player.dateBirth);
    console.log('playerDateToFormDate - using dateBirth, result:', result);
    return result;
  }

  // Fallback to fechaNacimiento timestamp
  if (player.fechaNacimiento) {
    // fechaNacimiento might be number or string
    const timestamp =
      typeof player.fechaNacimiento === 'string'
        ? parseInt(player.fechaNacimiento)
        : player.fechaNacimiento;

    console.log(
      'playerDateToFormDate - using fechaNacimiento timestamp:',
      timestamp
    );
    const date = timestampToDate(timestamp);
    console.log('playerDateToFormDate - converted to date:', date);
    const result = date ? dateToString(date) : '';
    console.log('playerDateToFormDate - final result:', result);
    return result;
  }

  console.log('playerDateToFormDate - no date found, returning empty string');
  return '';
}

/**
 * Calculate age from birth date
 */
export function calculateAge(birthDate: Date | string): number {
  const birth =
    typeof birthDate === 'string' ? stringToDate(birthDate) : birthDate;

  if (!birth) return 0;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}
