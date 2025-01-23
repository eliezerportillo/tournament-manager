import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IMatch } from '@app-core/models/match';
import { MatchSheet } from '@app-core/models/match-sheet';
import { IPlayer } from '@app-core/models/player';
import { SheetPlayer } from '@app-core/models/sheet-player';
import { MatchService } from '@app-core/services/match.service';
import { PlayerService } from '@app-core/services/player.service';
import { firstValueFrom, map, Observable, shareReplay } from 'rxjs';



@Component({
  selector: 'app-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.scss']
})
export class SheetComponent implements OnInit {
  local: string = '';
  visita: string = '';
  matchSheet?: MatchSheet;
  loading = false;


  playerService = inject(PlayerService);

  get match() {
    return this.matchSheet?.match;
  }

  get localPlayers() {
    return this.matchSheet?.localPlayers;
  }

  get awayPlayers() {
    return this.matchSheet?.awayPlayers;
  }

  constructor(private activatedRoute: ActivatedRoute, private matchService: MatchService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.local = params['local'] ?? '';
      this.visita = params['visita'] ?? '';
      this.loadMatchSheet();
    });
  }

  async loadMatchSheet() {
    this.loading = true;
    const localPlayers = await firstValueFrom(this.playerService.getPlayersByTeam(this.local).pipe(map(createSheetPlayer)));
    const visitaPlayers = await firstValueFrom(this.playerService.getPlayersByTeam(this.visita).pipe(map(createSheetPlayer)));
    const match = await this.matchService.getMatch(this.local, this.visita);
    const matchSheet: MatchSheet = {
      match,
      localPlayers: localPlayers,
      awayPlayers: visitaPlayers,
      comments: '',
    }

    this.matchSheet = matchSheet;
    this.loading = false;
  }

  handleOnChange(event: { player: SheetPlayer, value: number, field: keyof SheetPlayer }) {


    switch (event.field) {
      case 'goles':
        this.onGoalEvent(event);
        break;
      case 'amarillas':

        break;
      case 'rojas':

        break;
      default:
        return;
    }


  }

  onGoalEvent(event: { player: SheetPlayer, value: number }) {
    if (!this.matchSheet) {
      return;
    }

    const player = event.player;
    const value = event.value;

    if (player.equipo === this.local) {
      if (this.matchSheet.match.marcadorLocal) {
        this.matchSheet.match.marcadorLocal += value;
      } else {
        this.matchSheet.match.marcadorLocal = value;
      }

    } else {
      if (this.matchSheet.match.marcadorVisita) {
        this.matchSheet.match.marcadorVisita += value;
      } else {
        this.matchSheet.match.marcadorVisita = value;
      }

    }

  }

}

function createSheetPlayer(players: IPlayer[], index: number): SheetPlayer[] {
  const sheetPlayers = players.map(player => {
    return {
      ...player,
      goles: 0,
      amarillas: 0,
      rojas: 0,
      attended: false,
    } as SheetPlayer;
  });

  return sheetPlayers;

}

