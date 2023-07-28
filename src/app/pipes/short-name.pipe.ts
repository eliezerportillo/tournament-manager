import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortName'
})
export class ShortNamePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return '';
    }

    const nameParts = value.split(' ').filter(x => x.length > 2);
    const n = nameParts.reduce((acc, x, i) => i == 0 ? acc + x : `${acc} ${x.charAt(0).toUpperCase()}.`, '');
    return n;
    
  }
}
