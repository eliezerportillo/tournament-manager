import { ElementRef, Injectable } from '@angular/core';
import { Match } from '../models/match';

@Injectable({
  providedIn: 'root'
})
export class MatchScrollService {

  constructor() { }

  scrollToCurrentDayElement(elements: ElementRef[]) {
    // Your logic here...
    const currentDate = new Date();
    let closest = elements?.[0]; // Initialize with the first date
    let closestDate = new Date(closest?.nativeElement.getAttribute('data-date'));
    let closestDiff = Math.abs(currentDate.getTime() - closestDate.getTime());

    for (const element of elements ?? []) {
      const elementDate = new Date(element?.nativeElement.getAttribute('data-date'));
      const diff = Math.abs(currentDate.getTime() - elementDate.getTime());
      if (!Match.isFinished(elementDate) && diff < closestDiff) {
        closest = element;
        closestDiff = diff;
      }
    }

    if (closest?.nativeElement) {
      this.scrollToTargetAdjusted(closest?.nativeElement);
    }
  }

  private scrollToTargetAdjusted(element: any) {

    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - 55;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'auto'
    });
  }
}
