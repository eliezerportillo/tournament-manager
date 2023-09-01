import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QueryDocumentSnapshot, QueryFn } from '@angular/fire/compat/firestore';
import { map, shareReplay, tap } from 'rxjs/operators';
import { IMatch } from 'src/app/models/match';
import { Observable } from 'rxjs';
import { Team } from '../models/team';
import { LineUp } from '../models/lineup';
import { Group } from '../models/group';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  private matchesCollection: AngularFirestoreCollection<IMatch>;
  // private matches$: Observable<IMatch[]>;
  private standingsCollection: AngularFirestoreCollection<LineUp>;

  constructor(private db: AngularFirestore) {
    this.matchesCollection = this.db.collection<IMatch>('Partidos', ref => ref.orderBy('fecha'));
    this.standingsCollection = this.db.collection<LineUp>('Alineaciones');
    // this.matches$ = this.matchesCollection.valueChanges();
  }

  getMatches(): Observable<IMatch[]> {

    // Use snapshotChanges() to get an observable of changes in the collection
    const data$ = this.matchesCollection.snapshotChanges().pipe(
      tap(matches => {
        console.log(`${matches.length} Matches read`);
      }),
      map(actions =>
        actions.map(action => {
          return { id: action.payload.doc.id, ...action.payload.doc.data() } as IMatch;
        })
      )
    );

    return data$.pipe(

      map((matches: IMatch[]) => {
        return matches.map(match => ({
          ...match,
          dateTime: this.parseDateTime(match.fecha, match.hora),
          imageUrlLocal: Team.createImageUrl(match.local),
          imageUrlVisita: Team.createImageUrl(match.visita)
        })) as IMatch[]
      }),
      map((matches: IMatch[]) => matches.sort((a, b) => a.fecha - b.fecha))
    );
  }

  getMatchesGroupedByStage() {
    return this.getMatchesGroupedBy('jornada');
  }

  getMatchesGroupedByDate(){
    return this.getMatchesGroupedBy('fecha');
  }

  getMatchesGroupedBy(groupKey: string): Observable<Group<IMatch>[]> {
    return this.getMatches().pipe(
      map((array => this.groupBy(array, groupKey)))
    )
  }

  groupBy(dataArray: IMatch[], groupBy: string): Group<IMatch>[] {
    const grouped = dataArray.reduce((groupedData: { [key: string]: IMatch[] }, data: IMatch) => {
      const groupKey: string = <string>data[groupBy];
      if (!groupedData[groupKey]) {
        groupedData[groupKey] = [];
      }
      groupedData[groupKey].push(data);
      return groupedData;
    }, {});

    return Object.entries(grouped).map(([key, value]) =>
    (
      { key, values: value.sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()) }
    )
    );
  }


  async getLastMatchesByTeam(team: string, limit: number): Promise<IMatch[]> {
    const promises = [
      this.matchesCollection.ref.where('local', '==', team).where('marcadorLocal', '>=', 0).orderBy('marcadorLocal').orderBy('fecha', 'desc').orderBy('hora', 'desc').limit(limit).get(),
      this.matchesCollection.ref.where('visita', '==', team).where('marcadorVisita', '>=', 0).orderBy('marcadorVisita').orderBy('fecha', 'desc').orderBy('hora', 'desc').limit(limit).get()
    ];
    const responses = await Promise.all(promises);
    const teamMatches = responses[0].docs.map(this.parseDoc).concat(responses[1].docs.map(this.parseDoc));

    return teamMatches.sort((a, b) => {
      if (b.fecha !== a.fecha) {
        return b.fecha - a.fecha;
      } else {
        return b.hora - a.hora
      }
    });
  }

  async getMatchesByTeam(team: string) {
    const promises = [
      this.getFiltered('local', team),
      this.getFiltered('visita', team)
    ];
    const responses = await Promise.all(promises);
    const teamMatches = responses[0].concat(responses[1]);

    return teamMatches
      .map(match => ({
        ...match,

        dateTime: this.parseDateTime(match.fecha, match.hora),
        imageUrlLocal: Team.createImageUrl(match.local),
        imageUrlVisita: Team.createImageUrl(match.visita),
      })) as IMatch[];
  }



  async getMatch(local: string, visita: string): Promise<IMatch> {
    const snapshot = await this.matchesCollection.ref.where('local', '==', local).where('visita', '==', visita).get();
    return snapshot.docs.map(this.parseDoc)
      .map(match => ({
        ...match,
        dateTime: this.parseDateTime(match.fecha, match.hora),
        imageUrlLocal: Team.createImageUrl(match.local),
        imageUrlVisita: Team.createImageUrl(match.visita),
      }))[0] as IMatch;
  }

  private async getFiltered(filterBy: string, value: string): Promise<IMatch[]> {
    const snapshot = await this.matchesCollection.ref.where(filterBy, '==', value).get();
    return snapshot.docs.map(this.parseDoc);
  }

  private parseDateTime(fecha: number, hora: number) {
    const date = this.parseDate(fecha);
    const hourString = this.parseHour(hora);
    // Extract the hour and minute from the hourString
    this.setTime(hourString, date); // Set minutes to 0 if not provided

    return date;
  }

  private setTime(hourString: string, date: Date | null) {
    const [hour, minute] = hourString.split(':').map(Number);

    // Set the hour and minute to the Date object
    date?.setHours(hour);
    date?.setMinutes(minute || 0);
  }

  async getLineup(teamName: string) {
    const snapshot = await this.standingsCollection.ref.where('equipo', '==', teamName).orderBy('order').get();
    const players = snapshot.docs.map(this.parseDoc);
    return players;
  }

  private parseDoc<T>(doc: QueryDocumentSnapshot<T>) {
    return { id: doc.id, ...doc.data() }
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
