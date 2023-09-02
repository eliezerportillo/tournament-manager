import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateStatus'
})
export class DateStatusPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private locale: string) { }

  transform(value: Date | null): string {
    if (!value) return '';
    return this.compareDateToTodayAndTomorrow(value);
  }

  private compareDateToTodayAndTomorrow(inputDate: Date): string {
    // Clone the inputDate to avoid modifying the original
    const dateWithoutTime = new Date(inputDate);

    // Remove the time component from the cloned date
    dateWithoutTime.setHours(0, 0, 0, 0);

    // Create Date objects for today and tomorrow
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    // Remove the time component from today and tomorrow
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);

    // Compare the cloned date (dateWithoutTime) with today and tomorrow
    if (dateWithoutTime.getTime() === today.getTime()) {
      return 'Hoy';
    } else if (dateWithoutTime.getTime() === tomorrow.getTime()) {
      return 'Mañana';
    } else {
      // Check if inputDate is within the next 7 days
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      if (dateWithoutTime >= today && dateWithoutTime <= nextWeek) {
        // Get the day's name for inputDate
        const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
        const dayIndex = dateWithoutTime.getDay();
        const dayName = daysOfWeek[dayIndex];

        return `Próximo ${dayName}`;
      } else {
        const datePipe = new DatePipe(this.locale);
        return datePipe.transform(inputDate, 'mediumDate') ?? inputDate.toDateString();
      }
    }
  }
}