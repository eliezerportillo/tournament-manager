import { Injectable, inject } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  QueryDocumentSnapshot,
} from '@angular/fire/compat/firestore';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { IMatch } from '@app-core/models/match';
import { Observable, firstValueFrom, forkJoin, of } from 'rxjs';
import { LineUp } from '@app-core/models/lineup';
import { Group, Grouper } from '@app-core/models/group';
import { TeamService } from './team.service';
import { ExcelService } from './excel.service';
import { IMatchSheet, MatchSheet } from '@app-core/models/match-sheet';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  private excelService = inject(ExcelService);

  private matchesCollection: AngularFirestoreCollection<IMatch>;
  private sheetsCollection: AngularFirestoreCollection<IMatchSheet>;
  private matchesCache$?: Observable<IMatch[]>;
  private bracketCache$?: Observable<IMatch[]>;
  private standingsCollection: AngularFirestoreCollection<LineUp>;
  private nextMatchesCache$?: Observable<IMatch[]>;
  bracketCollection: AngularFirestoreCollection<IMatch>;
  private teamService = inject(TeamService);

  constructor(private db: AngularFirestore) {
    this.matchesCollection = this.db.collection<IMatch>('Partidos', (ref) =>
      ref.orderBy('fecha').where('esClasificacion', '==', 0)
    );
    this.sheetsCollection = this.db.collection<IMatchSheet>('sheets');
    this.standingsCollection = this.db.collection<LineUp>('Alineaciones');
    this.bracketCollection = this.db.collection<IMatch>('Partidos', (ref) =>
      ref
        .orderBy('ordenEtapa')
        .orderBy('numero')
        .where('esClasificacion', '==', 1)
    );
  }

  getMatches(): Observable<IMatch[]> {
    if (this.matchesCache$) {
      return this.matchesCache$;
    }

    this.matchesCache$ = this.getMatchesFromCollection(
      this.matchesCollection
    ).pipe(
      map((matches) =>
        matches.filter(
          (match) =>
            match.esClasificacion == undefined || match.esClasificacion == false
        )
      ),
      shareReplay(1)
    );

    return this.matchesCache$;
  }

  async getMatchesByDate(date: Date): Promise<IMatch[]> {
    const excelDate = this.excelService.convertJavascriptDateToExcel(date);
    if (excelDate === null) {
      throw new Error('Invalid date');
    }
    const collection = this.db.collection<IMatch>('Partidos', (ref) =>
      ref.orderBy('fecha').where('fecha', '==', excelDate)
    );
    return await firstValueFrom(this.getMatchesFromCollection(collection));
  }

  getMatchesGroupedByDate() {
    return this.getMatchesGroupedBy('fecha');
  }

  private getMatchesGroupedBy(groupKey: string): Observable<Group<IMatch>[]> {
    return this.getMatches().pipe(
      map((array) =>
        Grouper.groupBy(
          array,
          groupKey,
          (a, b) => a.dateTime.getTime() - b.dateTime.getTime()
        )
      )
    );
  }

  getBracket(): Observable<IMatch[]> {
    if (this.bracketCache$) {
      return this.bracketCache$;
    }
    this.bracketCache$ = this.getMatchesFromCollection(
      this.bracketCollection
    ).pipe(shareReplay(1));

    return this.bracketCache$;
  }

  private getMatchesFromCollection(
    collection: AngularFirestoreCollection<IMatch>
  ) {
    return collection.snapshotChanges().pipe(
      tap((matches) => {
        console.log(`${matches.length} Matches read`);
      }),
      map((actions) =>
        actions.map((action) => {
          return {
            id: action.payload.doc.id,
            ...action.payload.doc.data(),
          } as IMatch;
        })
      ),
      map((matches: IMatch[]) => {
        return matches.map((match) => ({
          ...match,
          dateTime: this.parseDateTime(match.fecha, match.hora),
        })) as IMatch[];
      }),
      map((matches: IMatch[]) => matches.sort((a, b) => a.hora - b.hora)),
      switchMap((matches) => this.getTeamImages(matches))
    );
  }

  private getTeamImages(matches: IMatch[]): Observable<IMatch[]> {
    if (matches.length === 0) {
      return of([]);
    }

    // Obtener todos los nombres únicos de equipos
    const uniqueTeamNames = Array.from(
      new Set([
        ...matches.map((match) => match.local),
        ...matches.map((match) => match.visita),
      ])
    );

    // Map each team to an observable that fetches the image URL
    const imageUrlObservables = uniqueTeamNames.map((teamName) =>
      this.teamService.getTeamImageUrl(teamName)
    );

    // Combine the observables into a single observable
    return forkJoin(imageUrlObservables).pipe(
      map((imageUrls) => {
        // Assign the image URLs to the corresponding models
        matches.forEach((match) => {
          match.imageUrlLocal = imageUrls[uniqueTeamNames.indexOf(match.local)];
          match.imageUrlVisita =
            imageUrls[uniqueTeamNames.indexOf(match.visita)];
        });

        return matches;
      })
    );
  }

  async getLastMatchesByTeam(team: string, limit: number): Promise<IMatch[]> {
    const promises = [
      this.matchesCollection.ref
        .where('local', '==', team)
        .where('marcadorLocal', '>=', 0)
        .orderBy('marcadorLocal')
        .orderBy('fecha', 'desc')
        .orderBy('hora', 'desc')
        .limit(limit)
        .get(),
      this.matchesCollection.ref
        .where('visita', '==', team)
        .where('marcadorVisita', '>=', 0)
        .orderBy('marcadorVisita')
        .orderBy('fecha', 'desc')
        .orderBy('hora', 'desc')
        .limit(limit)
        .get(),
    ];
    const responses = await Promise.all(promises);
    const teamMatches = responses[0].docs
      .map(this.parseDoc)
      .concat(responses[1].docs.map(this.parseDoc));

    return teamMatches.sort((a, b) => {
      if (b.fecha !== a.fecha) {
        return b.fecha - a.fecha;
      } else {
        return b.hora - a.hora;
      }
    });
  }

  async getMatchSheet(match: IMatch): Promise<IMatchSheet> {
    let snapshot = await this.sheetsCollection.ref
      .where('matchId', '==', match.id)
      .get();
    let sheets = snapshot.docs.map(this.parseDoc);

    if (sheets.length === 0) {
      snapshot = await this.sheetsCollection.ref
        .where('homeTeam', '==', match.local)
        .where('awayTeam', '==', match.visita)
        .get();
      sheets = snapshot.docs.map(this.parseDoc);
    }

    if (sheets.length === 0) {
      const matchSheet = new MatchSheet(match.id);
      matchSheet.homeTeam = match.local;
      matchSheet.awayTeam = match.visita;

      return matchSheet;
    }

    return sheets[0];
  }

  async getMatch(local: string, visita: string): Promise<IMatch> {
    const snapshot = await this.matchesCollection.ref
      .where('local', '==', local)
      .where('visita', '==', visita)
      .get();
    const matches = snapshot.docs.map(this.parseDoc);

    if (matches.length === 0) {
      return {} as IMatch; // Handle the case of no matches found according to your logic
    }

    // Use getTeamImages to handle image URLs and cache logic
    const matchesWithUrls = await firstValueFrom(this.getTeamImages(matches));

    // Return the first match in the set with assigned URLs
    return {
      ...matchesWithUrls[0],
      dateTime: this.parseDateTime(
        matchesWithUrls[0].fecha,
        matchesWithUrls[0].hora
      ),
    } as IMatch;
  }

  private async getFiltered(
    filterBy: string,
    value: string
  ): Promise<IMatch[]> {
    const snapshot = await this.matchesCollection.ref
      .where(filterBy, '==', value)
      .get();
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
    const snapshot = await this.standingsCollection.ref
      .where('equipo', '==', teamName)
      .orderBy('order')
      .get();
    const players = snapshot.docs.map(this.parseDoc);
    return players;
  }

  private parseDoc<T>(doc: QueryDocumentSnapshot<T>) {
    return { id: doc.id, ...doc.data() };
  }

  private parseDate(excelDate: number): Date | null {
    return this.excelService.convertExcelDateToJSDate(excelDate);
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
