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
    this.matchesCollection = this.db.collection<Match>('Partidos');
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
      }),
      map((matches: Match[]) => matches.slice().sort((a, b) => a.hour.localeCompare(b.hour)))
    );
  }

  createImageUrl(teamName: string): any {
    return `assets/${teamName}.png`;
  }

  parseDate(excelDate: number): Date | null {

    if (!excelDate) {
      return null;
    }
    // Adjust the number of days between Excel epoch (January 1, 1900) and JavaScript's epoch (January 1, 1970)
    const excelEpochDiff = 25568; // for Windows (1900) or 24107 for Mac (1904)

    // Convert the Excel date to JavaScript timestamp (milliseconds since January 1, 1970)
    const javascriptTimestamp = (excelDate - excelEpochDiff) * 86400 * 1000;

    // Create a new Date object with the JavaScript timestamp
    return new Date(javascriptTimestamp);
  }

  parseHour(excelHour: number): string {
    if (!excelHour) {
      return '';
    }
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
