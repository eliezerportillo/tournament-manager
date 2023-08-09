import { Component, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Team } from 'src/app/models/team';
import { firstValueFrom } from 'rxjs';
import { PlayerService } from 'src/app/services/player.service';
import { Player, PlayerType } from 'src/app/models/player';
import { LineUp } from 'src/app/models/lineup';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ListSelectorComponent } from 'src/app/players/list-selector/list-selector.component';
import { UploadLineupCommand } from 'src/app/services/upload-lineup.command';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-upload-lineup',
  templateUrl: './upload-lineup.component.html',
  styleUrls: ['./upload-lineup.component.scss']
})
export class UploadLineupComponent {


  auth: AngularFireAuth = inject(AngularFireAuth);
  playerService: PlayerService = inject(PlayerService);
  bottomSheet: MatBottomSheet = inject(MatBottomSheet);
  uploadCommand: UploadLineupCommand = inject(UploadLineupCommand);
  snackBar: MatSnackBar = inject(MatSnackBar);

  captain?: Player;
  lineupPlaceholder: LineUp[] = [];
  team: Player[] = [];
  PLACEHOLDER = 'Seleccionar';
  loading: boolean = false;


  get localImageUrl(): string {
    return Team.createImageUrl(this.captain?.equipo ?? '');
  }

  get substitutes() {
    return this.team.filter(p => !this.lineupPlaceholder.map(x => x.jugador).includes(p.jugador))
  }

  get lineupCompleted() {
    return this.lineupPlaceholder.filter(p => p.jugador != this.PLACEHOLDER).length == 7;
  }

  getPortero() {
    return this.lineupPlaceholder.find(x => x.playerType == 'portero');
  }

  getDefenses() {
    return this.lineupPlaceholder.filter(x => x.playerType == 'defensa')
  }

  getMidfielder() {
    return this.lineupPlaceholder.filter(x => x.playerType == 'medio')
  }

  getStriker() {
    return this.lineupPlaceholder.filter(x => x.playerType == 'delantero')
  }


  async handleUpload() {
    this.loading = true;
    await this.uploadCommand.execute(this.lineupPlaceholder, this.substitutes);
    this.snackBar.open('Alineación enviada con éxito');
    this.loading = false;
  }

  private async loadPlayers(teamName: string) {
    this.team = await this.playerService.getPlayersByTeam(teamName);

  }

  async openBottomSheet(position?: LineUp) {

    if (!position) return;

    let players;
    if (position.playerType == 'portero') {
      players = this.substitutes.filter(p => p.portero);
    } else {
      players = this.substitutes.filter(p => !p.portero);
    }
    const ref = this.bottomSheet.open(ListSelectorComponent, { data: { players } });
    const selectedPlayer: LineUp | undefined = await firstValueFrom(ref.afterDismissed());
    if (selectedPlayer) {
      position.equipo = selectedPlayer.equipo;
      position.jugador = selectedPlayer.jugador;
    }


  }


  ngOnInit(): void {

    firstValueFrom(this.auth.authState).then(async (user) => {
      if (user && user.email) {
        this.captain = await this.playerService.getPlayerByEmail(user.email);

        if (!this.captain) {
          return;
        }

        this.initLineupPlaceholder(this.captain);
        this.loadPlayers(this.captain.equipo);

      }
    });
  }

  private initLineupPlaceholder(captain: Player) {

    this.lineupPlaceholder = [
      {
        equipo: captain.equipo,
        jugador: this.PLACEHOLDER,
        playerType: 'portero',
        order: 1
      },
      {
        equipo: captain.equipo,
        jugador: this.PLACEHOLDER,
        playerType: 'defensa',
        order: 2
      },
      {
        equipo: captain.equipo,
        jugador: this.PLACEHOLDER,
        playerType: 'defensa',
        order: 3
      },
      {
        equipo: captain.equipo,
        jugador: this.PLACEHOLDER,
        playerType: 'defensa',
        order: 4
      },
      {
        equipo: captain.equipo,
        jugador: this.PLACEHOLDER,
        playerType: 'medio',
        order: 5
      },
      {
        equipo: captain.equipo,
        jugador: this.PLACEHOLDER,
        playerType: 'delantero',
        order: 6
      },
      {
        equipo: captain.equipo,
        jugador: this.PLACEHOLDER,
        playerType: 'delantero',
        order: 7
      }
    ];;
  }
}
