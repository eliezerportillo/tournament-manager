import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IBadge } from '@app-core/models/bagde';
import { IPlayer } from '@app-core/models/player';
import { Observable, firstValueFrom, forkJoin, from, of } from 'rxjs';
import { catchError, concatMap, map, take, tap } from 'rxjs/operators';
import { BadgeService } from './badge.service';

@Injectable({
  providedIn: 'root'
})
export class CleanOldBadgesCommand {

  db = inject(AngularFirestore);
  badgeService = inject(BadgeService);
  constructor() { }

  execute() {
    return this.deleteBadgesWithoutPlayer();
  }

  async deleteBadgesWithoutPlayer() {
    let badgesToDelete: IBadge[] = [];
    // Get all badges

    for (const badge of await firstValueFrom(this.badgeService.get())) {
      // Check if there is a corresponding player in the Players collection
      const playerExists = await firstValueFrom(this.checkPlayer(badge));
      if (!playerExists) {
        // If there is no corresponding player, delete the badge
        console.log(`Marked to delete: ${badge.teamName}-${badge.playerName}`);
        badgesToDelete.push(badge);
      }
    }

    await this.badgeService.deleteBadges(badgesToDelete);
    console.log(`${badgesToDelete.length} badges deleted`)

    return badgesToDelete.length;

  }

  

  private checkPlayer(badge: IBadge): Observable<boolean> {
    // Perform a query to check if there is a corresponding player
    return this.db.collection<IPlayer>('Jugadores', ref =>
      ref.where('equipo', '==', badge.teamName).where('jugador', '==', badge.playerName)
    ).valueChanges().pipe(
      map(players => players.length > 0)
    );
  }
}
