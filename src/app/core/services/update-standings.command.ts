import { Injectable } from '@angular/core';
import { IMatch, MatchResult } from '@app-core/models/match';
import { ITeam } from '@app-core/models/team';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UpdateStandingsCommand {



  constructor(private db: AngularFirestore) { }

  async execute(matches: IMatch[], previous: ITeam[]) {
    const standings = this.calcKardex(matches, previous);
    await this.saveDataToFirestore(standings);
    return standings;
  }

  calcKardex(matches: IMatch[], previous: ITeam[]) {
    const scoredTeams = this.calcStandings(previous, matches);
    const orderedTeams: ITeam[] = this.sortByCriteria(scoredTeams);
    const standings = this.calcTrend(previous, orderedTeams);
    return standings;
  }

  private calcTrend(previous: ITeam[], news: ITeam[]) {


    news.forEach((team, index) => {
      const prevIndex = previous.findIndex(x => x.nombre == team.nombre);
      if (prevIndex >= 0) {
        if (index < prevIndex) {
          // down
          team.tendencia = '>';
        } else if (index > prevIndex) {
          // up
          team.tendencia = '<';
        } else {
          // equals
          team.tendencia = '=';
        }
      }
    });

    return news;
  }

  private calcStandings(teams: ITeam[], matches: IMatch[]) {
    const _teams: ITeam[] = JSON.parse(JSON.stringify(teams));

    // reset
    for (const team of _teams) {
      team.tendencia = '';
      team.PJ = 0;
      team.G = 0;
      team.E = 0;
      team.P = 0;
      team.GF = 0;
      team.GC = 0;
      team.DG = 0;
      team.Pts = 0;
    }

    for (const match of matches.map(x => new MatchResult(x)).filter(x => x.played)) {

      const local = _teams.find(x => match.local == x.nombre);
      const visita = _teams.find(x => match.visita == x.nombre);

      if (local) {
        local.PJ = Number(local.PJ ?? 0) + 1;
        local.GF = Number(local.GF ?? 0) + Number(match.marcadorLocal);
        local.GC = Number(local.GC ?? 0) + Number(match.marcadorVisita);
        local.DG = local.GF - local.GC;
      }

      if (visita) {
        visita.PJ = Number(visita.PJ ?? 0) + 1;
        visita.GF = Number(visita.GF ?? 0) + Number(match.marcadorVisita);
        visita.GC = Number(visita.GC ?? 0) + Number(match.marcadorLocal);
        visita.DG = visita.GF - visita.GC;
      }

      // Detect winner
      if (match.hasWinner) {
        // when winner
        const winner = _teams.find(x => match.winner == x.nombre);
        const loser = _teams.find(x => match.loser == x.nombre);

        if (winner) {
          winner.G = Number(winner.G ?? 0) + 1;
        }

        if (loser) {
          loser.P = Number(loser.P ?? 0) + 1;
        }

      }
      else {
        // When draw
        if (local) {
          local.E = Number(local.E ?? 0) + 1;
        }
        if (visita) {
          visita.E = Number(visita.E ?? 0) + 1;
        }
      }

      // count points
      if (local) {
        local.Pts = (Number(local.G ?? 0) * 3) + (Number(local.E ?? 0) * 1);
      }
      if (visita) {
        visita.Pts = (Number(visita.G ?? 0) * 3) + (Number(visita.E ?? 0) * 1);
      }
    }

    return _teams;
  }

  private sortByCriteria(kardex: ITeam[]): ITeam[] {
    // return ref.orderBy('Pts', 'desc').orderBy('DG', 'desc').orderBy('GF', 'desc').orderBy('GC').orderBy('nombre');
    return kardex.sort((a, b) => {
      if (a.Pts !== b.Pts) {
        return b.Pts - a.Pts;
      } else if (a.DG !== b.DG) {
        return b.DG - a.DG;
      } else if (a.GF !== b.GF) {
        return b.GF - a.GF;
      } else if (a.GC !== b.GC) {
        return b.GC - a.GC;
      } else {
        return a.nombre.localeCompare(b.nombre);
      }
    });
  }

  async saveDataToFirestore(data: ITeam[]) {
    try {
      const collectionRef = this.db.firestore.collection('Equipos');

      // Using batch to perform a batch write for faster insertion
      const batch = this.db.firestore.batch();

      data.forEach((item) => {
        const docRef = collectionRef.doc(item.id); // Auto-generated document ID
        batch.set(docRef, item);
      });

      await batch.commit();

    } catch (error) {
      console.error(`Error saving data from 'Equipos' to Firestore:`, error);
    }
  }

}
