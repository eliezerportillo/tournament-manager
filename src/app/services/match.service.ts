import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Match } from 'src/app/models/match';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private matchesCollection: AngularFirestoreCollection<Match>;
  private matches$: Observable<Match[]>;

  constructor(private db: AngularFirestore) {
    this.matchesCollection = this.db.collection<Match>('Partidos', ref => ref.orderBy('hora'));
    this.matches$ = this.matchesCollection.valueChanges();
  }

  getMatches(): Observable<Match[]> {
    return this.matches$.pipe(
      map((matches: Match[]) => {
        return matches.map(match => ({
          ...match,
          date: this.parseDate(match.fecha),
          hour: this.parseHour(match.hora),
          imageUrlLocal: this.createImageUrl(match.local),
          imageUrlVisita: this.createImageUrl(match.visita),
        })) as Match[]
      })
    );
  }

  createImageUrl(teamName: string): any {
    return `assets/${teamName}.png`;
  }

  parseDate(dateValue: number): Date | null {
    // Excel stores dates as the number of days since January 1, 1900
    // Excel uses 1900 as the base year, but the Date object uses 1970, so we need to adjust for the difference
    const msPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const daysBetweenDates = dateValue - 25569; // 25569 is the number of days between 1900-01-01 and 1970-01-01
    const jsDateTimestamp = daysBetweenDates * msPerDay;
    return new Date(jsDateTimestamp);
  }

  parseHour(excelHour: number): string {
    let hour = Math.floor(excelHour * 24);
    let minute = Math.round((excelHour * 24 - hour) * 60);

    // Handle case where minute is 60 (due to rounding)
    if (minute === 60) {
      hour += 1;
      minute = 0;
    }

    // Format the hour and minute as a string
    const hourString = hour.toString().padStart(2, '0');
    const minuteString = minute.toString().padStart(2, '0');

    return `${hourString}:${minuteString}`;
  }
}
