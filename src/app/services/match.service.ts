import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Match } from 'src/app/models/match';
import { Observable } from 'rxjs';
import { Team } from '../models/team';
import { LineUp } from '../models/lineup';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private matchesCollection: AngularFirestoreCollection<Match>;
  private matches$: Observable<Match[]>;
  private standingsCollection: AngularFirestoreCollection<LineUp>;

  constructor(private db: AngularFirestore) {
    this.matchesCollection = this.db.collection<Match>('Partidos');
    this.standingsCollection = this.db.collection<LineUp>('Alineaciones');
    this.matches$ = this.matchesCollection.valueChanges();
  }

  getMatches(): Observable<Match[]> {
    return this.matches$.pipe(
      map((matches: Match[]) => {
        return matches.map(match => ({
          ...match,
          date: this.parseDate(match.fecha),
          dateTime: this.parseDateTime(match.fecha, match.hora),
          hour: this.parseHour(match.hora),
          imageUrlLocal: Team.createImageUrl(match.local),
          imageUrlVisita: Team.createImageUrl(match.visita),
        })) as Match[]
      }),
      map((matches: Match[]) => matches.slice().sort((a, b) => a.hour.localeCompare(b.hour)))
    );
  }



  async getMatch(local: string, visita: string) {
    const snapshot = await this.matchesCollection.ref.where('local', '==', local).where('visita', '==', visita).get();
    return snapshot.docs.map(doc => doc.data())
      .map(match => ({
        ...match,
        date: this.parseDate(match.fecha),
        dateTime: this.parseDateTime(match.fecha, match.hora),
        hour: this.parseHour(match.hora),
        imageUrlLocal: Team.createImageUrl(match.local),
        imageUrlVisita: Team.createImageUrl(match.visita),
      }))[0] as Match;
  }

  private parseDateTime(fecha: number, hora: number) {
    const date = this.parseDate(fecha);
    const hourString = this.parseHour(hora);
    // Extract the hour and minute from the hourString
    const [hour, minute] = hourString.split(':').map(Number);

    // Set the hour and minute to the Date object
    date?.setHours(hour);
    date?.setMinutes(minute || 0); // Set minutes to 0 if not provided

    return date;
  }

  async getLineup(teamName: string) {
    const snapshot = await this.standingsCollection.ref.where('equipo', '==', teamName).orderBy('jugador').get();
    const players = snapshot.docs.map(doc => doc.data());
    return this.moveItemToFirstPosition(players, (p) => p.portero);
  }

  private moveItemToFirstPosition(arr: any[], criteria: (item: any) => boolean): any[] {
    // Find the index of the item that satisfies the criteria
    const index = arr.findIndex(criteria);

    if (index !== -1) {

      // Add the item to the first position using unshift
      arr.unshift(arr[index]);

      // Remove the item from its current position using splice
      arr.splice(index, 1);
    }

    return arr;
  }

  private parseDate(excelDate: number): Date | null {

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

  private parseHour(excelHour: number): string {
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
