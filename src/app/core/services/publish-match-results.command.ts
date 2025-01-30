import { MatchSheet } from '@app-core/models/match-sheet';
import { IPlayer } from '@app-core/models/player';
import { IMatch } from '@app-core/models/match';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PublishMatchResultsCommand {

    constructor(private firestore: AngularFirestore) {}

    async execute(sheet: MatchSheet, match: IMatch): Promise<void> {
        const batch = this.firestore.firestore.batch();

        // Update match scores
        const matchRef = this.firestore.collection('Partidos').doc(match.id).ref;
        batch.update(matchRef, {
            marcadorLocal: sheet.homeScore,
            marcadorVisita: sheet.awayScore
        });

        // Update player stats
        sheet.players.forEach(player => {
            const playerRef = this.firestore.collection('Jugadores').doc(player.playerId).ref;
            batch.update(playerRef, {
                goles: player.goals,
                asistencias: player.assists,
                amarillas: player.yellowCards,
                rojas: player.redCards
            });
        });

        await batch.commit();
    }
}