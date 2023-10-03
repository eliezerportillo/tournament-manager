import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  constructor() { }

  // Create an EventEmitter instance
  public sponsorClicked: EventEmitter<string> = new EventEmitter();

  // Method to emit events
  emitSponsorClickedEvent(sponsorName: string) {
    this.sponsorClicked.emit(sponsorName);
  }
}
