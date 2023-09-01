import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform, inject } from '@angular/core';

@Pipe({
  name: 'hour'
})
export class HourPipe implements PipeTransform {

  datePipe: DatePipe = inject(DatePipe);

  transform(date: Date): string | null {
    return this.datePipe.transform(date, 'h:mm a');
  }

}
