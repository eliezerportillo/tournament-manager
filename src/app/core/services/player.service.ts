import { inject, Injectable, } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, } from '@angular/fire/compat/firestore';
import { Observable, firstValueFrom, map, of } from 'rxjs';
import { IPlayer, Player } from '@app-core/models/player';
import { Stats } from '@app-core/models/stats';
import { IBadge } from '@app-core/models/bagde';
import { ExcelService } from './excel.service';

type WhereFilterOp =
  | '<'
  | '<='
  | '=='
  | '!='
  | '>='
  | '>'
  | 'array-contains'
  | 'in'
  | 'array-contains-any'
  | 'not-in';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private excelService = inject(ExcelService);

  playersCollection: AngularFirestoreCollection<IPlayer>;
  stats?: Stats;



  constructor(private db: AngularFirestore) {
    this.playersCollection = this.db.collection<IPlayer>('Jugadores');

  }

  async getBadge(player: IPlayer): Promise<IBadge | null> {

    const snapshot = await this.db.collection<IBadge>('badges').ref
      .where('teamName', '==', player.equipo)
      .where('playerName', '==', player.name || player.jugador)
      .get();

    const data = snapshot.docs[0];
    if (!data) return null;
    const obj = { id: data.id, ...data.data() } as IBadge;
    return obj;
  }

  async getGoalKeepers(teamName: string): Promise<IPlayer[]> {
    const snapshot = await this.playersCollection.ref.orderBy('portero').where('equipo', '==', teamName).where('portero', '==', 1).get();
    return snapshot.docs.map(doc => doc.data());
  }

  getPlayersByTeam(teamName: string): Observable<IPlayer[]> {
    return this.db.collection<IPlayer>('Jugadores', ref => ref.orderBy('jugador').where('equipo', '==', teamName))
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(action => {
            const obj = { id: action.payload.doc.id, ...action.payload.doc.data() } as IPlayer;
            obj.dateBirth = this.excelService.parseDate(obj.fechaNacimiento);
            return new Player(obj);
          })
        )
      );
  }

  async getPlayerByEmail(email: string): Promise<IPlayer> {
    return (await this.getFiltered('correo', '==', email))[0];
  }

  async getCaptains(): Promise<IPlayer[]> {
    return this.getFiltered('capitan');
  }

  async getPlayersStats(): Promise<Stats> {
    if (this.stats) {
      return firstValueFrom(of(this.stats));
    }

    const promises = [
      this.getFiltered('goles'),
      this.getFiltered('amarillas'),
      this.getFiltered('rojas')
    ];
    const responses = await Promise.all(promises);

    const stats: Stats = {
      goals: responses[0],
      yellows: responses[1],
      reds: responses[2],
    }

    this.stats = stats;

    return stats;
  }

  private async getFiltered(filterBy: string, op: WhereFilterOp = '>', value: unknown = 0) {
    const snapshot = await this.playersCollection.ref.orderBy(filterBy).orderBy('jugador').where(filterBy, op, value).get();
    const data = snapshot.docs.map(doc => doc.data());
    console.log(`${data.length} Players read filtered by ${filterBy} ${op} ${value}`);
    return data;
  }


}
