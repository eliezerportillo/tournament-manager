import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateStatus'
})
export class DateStatusPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private locale: string) { }

  transform(value: Date): string {
    const now = new Date();
    const diffInMilliseconds = value.getTime() - now.getTime();
    const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);

    if (diffInDays >= 1 && diffInDays < 2) {
      return 'Mañana';
    } else if (diffInDays >= 0 && diffInDays < 1) {
      return 'Hoy';
    } else if (diffInDays >= 2 && diffInDays < 7) {
      const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
      const dayOfWeek = value.getDay();
      return daysOfWeek[dayOfWeek];
    } else {
      const datePipe = new DatePipe(this.locale);
      return datePipe.transform(value, 'mediumDate') ?? value.toDateString();
    }
  }
}