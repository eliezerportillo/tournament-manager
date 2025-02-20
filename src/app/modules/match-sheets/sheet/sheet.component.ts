import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { IMatch } from '@app-core/models/match';
import {
  IMatchSheet,
  IMatchSheetPlayer,
  MatchSheetPlayer,
} from '@app-core/models/match-sheet';
import { IPlayer } from '@app-core/models/player';
import { SheetPlayer } from '@app-core/models/sheet-player';
import { MatchService } from '@app-core/services/match.service';
import { PlayerService } from '@app-core/services/player.service';
import { PublishMatchResultsCommand } from '@app-core/services/publish-match-results.command';
import { RegisterPlayerAttendanceCommand } from '@app-core/services/register-player-attendance.command';
import { RouteService } from '@app-core/services/route.service';
import { UpdatePlayerAssistsCommand } from '@app-core/services/update-player-assits.commad';
import { UpdatePlayerRedCardCommand } from '@app-core/services/update-player-red-cards.command';
import { UpdatePlayerYellowCardCommand } from '@app-core/services/update-player-yellow-card.command';
import { UpdateScoreOnGoalEventCommand } from '@app-core/services/update-score-on-goal-event.command';
import { UpdateScoreOnOwnGoalEventCommand } from '@app-core/services/update-score-on-own-goal-event-command.service';
import {
  combineLatest,
  concat,
  firstValueFrom,
  map,
  Observable,
  of,
  shareReplay,
} from 'rxjs';

@Component({
  selector: 'app-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.scss'],
})
export class SheetComponent implements OnInit {
  local = '';
  visita = '';
  matchSheet?: IMatchSheet;
  loading = false;
  snackBar = inject(MatSnackBar);

  updateScoreOnGoalEventCommand = inject(UpdateScoreOnGoalEventCommand);
  updateScoreOnOwnGoalEventCommand = inject(UpdateScoreOnOwnGoalEventCommand);
  updatePlayerYellowCardCommand = inject(UpdatePlayerYellowCardCommand);
  updatePlayerRedCardCommand = inject(UpdatePlayerRedCardCommand);
  updatePlayerAssistsCommand = inject(UpdatePlayerAssistsCommand);
  registerPlayerAttendanceCommand = inject(RegisterPlayerAttendanceCommand);
  publishResultsCommand = inject(PublishMatchResultsCommand);
  breakpointObserver = inject(BreakpointObserver);
  routeService = inject(RouteService);

  playerService = inject(PlayerService);
  homePlayers: SheetPlayer[] = [];
  awayPlayers: SheetPlayer[] = [];
  match?: IMatch;
  opened = true;
  zone = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private matchService: MatchService
  ) {}

  get totalYellowCards() {
    return (
      this.matchSheet?.players
        .map((p) => p.yellowCards)
        .reduce((acc, curr) => acc + curr, 0) ?? 0
    );
  }

  get totalRedCards() {
    return (
      this.matchSheet?.players
        .map((p) => p.redCards)
        .reduce((acc, curr) => acc + curr, 0) ?? 0
    );
  }

  get canPublish() {
    return (
      this.matchSheet?.status !== 'published' &&
      this.matchSheet?.homeScore !== undefined &&
      this.matchSheet?.awayScore !== undefined
    );
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.local = params['local'] ?? '';
      this.visita = params['visita'] ?? '';
      this.loadMatchSheet();
    });

    // Access grandparent route's params
    this.zone = this.routeService.findZoneRouteParam(
      this.activatedRoute.snapshot
    );

    this.breakpointObserver
      .observe([
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Handset,
        Breakpoints.TabletPortrait,
      ])
      .subscribe((result) => {
        if (result.matches) {
          this.opened = false;
        }
      });
  }

  async loadMatchSheet() {
    this.loading = true;
    this.match = await this.matchService.getMatch(this.local, this.visita);
    this.matchSheet = await this.matchService.getMatchSheet(this.match);

    this.homePlayers = await firstValueFrom(
      this.playerService
        .getPlayersByTeam(this.local)
        .pipe(
          map((players) =>
            this.createSheetPlayer(players, this.matchSheet?.players ?? [])
          )
        )
    );
    this.awayPlayers = await firstValueFrom(
      this.playerService
        .getPlayersByTeam(this.visita)
        .pipe(
          map((players) =>
            this.createSheetPlayer(players, this.matchSheet?.players ?? [])
          )
        )
    );

    this.loading = false;
  }

  onAttendedEventScanner(playerId: string) {
    const player =
      this.homePlayers.find((p) => p.id === playerId) ??
      this.awayPlayers.find((p) => p.id === playerId);
    if (!player) {
      return;
    }
    this.onAttendedEvent({ player, value: true });
  }

  attendanceNumber(players: SheetPlayer[]) {
    return players.filter((p) => p.attended).length;
  }

  onYellowCardEvent(event: { player: SheetPlayer; value: number }) {
    if (!this.matchSheet) {
      return;
    }
    this.updatePlayerYellowCardCommand.execute(
      event.player,
      this.matchSheet.matchId,
      event.value
    );
    this.modifyValue(event.player, 'amarillas', event.value);
    const playerIndex = this.matchSheet.players.findIndex(
      (p) => p.playerId === event.player.id
    );
    this.matchSheet.players[playerIndex].yellowCards += event.value;
  }

  onRedCardEvent(event: { player: SheetPlayer; value: number }) {
    if (!this.matchSheet) {
      return;
    }
    this.updatePlayerRedCardCommand.execute(
      event.player,
      this.matchSheet.matchId,
      event.value
    );
    this.modifyValue(event.player, 'rojas', event.value);
    const playerIndex = this.matchSheet.players.findIndex(
      (p) => p.playerId === event.player.id
    );
    this.matchSheet.players[playerIndex].redCards += event.value;
  }

  onAttendedEvent(event: { player: SheetPlayer; value: boolean }) {
    if (!this.matchSheet || !this.match) {
      return;
    }

    this.registerPlayerAttendanceCommand.execute(
      event.player,
      this.match,
      event.value
    );

    // add player to the match sheet if not already there when value is true
    if (event.value) {
      if (
        !this.matchSheet.players.find((p) => p.playerId === event.player.id)
      ) {
        const player = new MatchSheetPlayer(
          event.player.id,
          event.player.jugador,
          event.player.equipo,
          event.value
        );
        this.matchSheet.players.push(player);
      }
    } else {
      // remove player from the match sheet when value is false
      this.matchSheet.players = this.matchSheet.players.filter(
        (p) => p.playerId !== event.player.id
      );
    }
  }

  onAssistEvent(event: { player: SheetPlayer; value: number }) {
    if (!this.matchSheet) {
      return;
    }
    this.updatePlayerAssistsCommand.execute(
      event.player,
      this.matchSheet.matchId,
      event.value
    );
    this.modifyValue(event.player, 'asistencias', event.value);
  }

  onGoalEvent(event: { player: SheetPlayer; value: number }) {
    if (!this.matchSheet) {
      return;
    }

    if (!this.match) {
      return;
    }

    this.updateScoreOnGoalEventCommand.execute(
      event.player,
      this.match,
      event.value
    );
    this.modifyValue(event.player, 'goles', event.value);
    this.matchSheet.homeScore +=
      event.player.equipo === this.local ? event.value : 0;
    this.matchSheet.awayScore +=
      event.player.equipo === this.visita ? event.value : 0;
  }

  onOwnGoalEvent(event: { player: SheetPlayer; value: number }) {
    if (!this.matchSheet) {
      return;
    }

    if (!this.match) {
      return;
    }

    this.updateScoreOnOwnGoalEventCommand.execute(
      event.player,
      this.match,
      event.value
    );
    this.modifyValue(event.player, 'autogoles', event.value);
    this.matchSheet.homeScore +=
      event.player.equipo === this.match.visita ? event.value : 0;
    this.matchSheet.awayScore +=
      event.player.equipo === this.match.local ? event.value : 0;
  }

  modifyValue(
    player: SheetPlayer,
    key: 'goles' | 'asistencias' | 'amarillas' | 'rojas' | 'autogoles',
    value: number
  ) {
    if (player && player[key] !== undefined) {
      player[key] = (player[key] ?? 0) + value;
    }
  }

  createSheetPlayer(
    players: IPlayer[],
    sheetPlayers: IMatchSheetPlayer[]
  ): SheetPlayer[] {
    const mappedPlayers = players.map((player) => {
      const existingPlayer = sheetPlayers.find(
        (p) => p.playerId === player.id || p.playerName === player.jugador
      );
      return {
        ...player,
        goles: existingPlayer?.goals ?? 0,
        autogoles: existingPlayer?.ownGoals ?? 0,
        asistencias: existingPlayer?.assists ?? 0,
        amarillas: existingPlayer?.yellowCards ?? 0,
        rojas: existingPlayer?.redCards ?? 0,
        attended: existingPlayer?.attended ?? false,
      } as SheetPlayer;
    });

    return mappedPlayers;
  }

  async publishResults() {
    if (!this.matchSheet || !this.match) {
      return;
    }

    if (this.matchSheet.players.length === 0) {
      this.snackBar.open(
        'No hay asistencia de jugadores para publicar resultados',
        'Cerrar',
        {
          duration: 3000,
        }
      );
      return;
    }
    this.loading = true;
    await this.publishResultsCommand.execute(this.matchSheet, this.match);
    this.matchSheet.status = 'published';
    this.loading = false;
    // Assuming you have a MatSnackBar injected in your component
    this.snackBar.open('Resultados publicados existósamente', 'Cerrar', {
      duration: 3000,
    });
  }
}
