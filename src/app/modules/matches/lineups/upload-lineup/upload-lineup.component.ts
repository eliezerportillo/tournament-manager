import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Team } from '@app-core/models/team';
import { firstValueFrom } from 'rxjs';
import { PlayerService } from '@app-core/services/player.service';
import { IPlayer, PlayerType } from '@app-core/models/player';
import { LineUp, Markable } from '@app-core/models/lineup';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ListSelectorComponent } from '@app-modules/matches/players/list-selector/list-selector.component';
import { UploadLineupCommand } from '@app-core/services/upload-lineup.command';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Formation } from '@app-core/models/formation';
import { FormControl } from '@angular/forms';
import { FormationPickerComponent } from '@app-modules/matches/formation-picker/formation-picker.component';
import { TeamService } from '@app-core/services/team.service';

@Component({
  selector: 'app-upload-lineup',
  templateUrl: './upload-lineup.component.html',
  styleUrls: ['./upload-lineup.component.scss']
})
export class UploadLineupComponent implements OnInit {


  auth: AngularFireAuth = inject(AngularFireAuth);
  playerService: PlayerService = inject(PlayerService);
  bottomSheet: MatBottomSheet = inject(MatBottomSheet);
  uploadCommand: UploadLineupCommand = inject(UploadLineupCommand);
  snackBar: MatSnackBar = inject(MatSnackBar);
  teamService = inject(TeamService);

  captain?: IPlayer;
  localImageUrl: string = '';

  team: IPlayer[] = [];
  loading = false;
  formationCompleted = false;
  futSystems: Formation[];


  selectedFormationControl: FormControl;

  @ViewChild(FormationPickerComponent) formationPicker?: FormationPickerComponent;



  constructor() {
    const systems = [
      [1, 3, 3],
      [1, 3, 1, 2],
      [1, 3, 2, 1],
      [1, 4, 2],
      [1, 2, 2, 2],
      [1, 2, 3, 1],
    ];
    this.futSystems = systems.map(s => new Formation(...s));
    this.selectedFormationControl = new FormControl(this.futSystems[0]);
  }

  get selectedFormation() {
    return this.selectedFormationControl.value as Formation;
  }


  get startings() {
    return this.formationPicker?.builder?.players ?? [];
  }

  get substitutes() {
    return this.team.filter(p => !this.startings.map(x => x.name).includes(p.name))
  }


  async handleUpload() {
    this.loading = true;
    await this.uploadCommand.execute(this.startings, this.substitutes);
    this.snackBar.open('Alineación enviada con éxito');
    this.loading = false;
  }


  private async loadPlayers(teamName: string) {
    this.team = await firstValueFrom(this.playerService.getPlayersByTeam(teamName));
  }

  async openBottomSheet(position?: Markable) {

    if (!position) return;

    let players;
    if (position.playerType == PlayerType.portero) {
      players = this.substitutes.filter(p => p.portero);
    } else {
      players = this.substitutes;
    }
    const ref = this.bottomSheet.open(ListSelectorComponent, { data: { players } });
    const selectedPlayer: LineUp | undefined = await firstValueFrom(ref.afterDismissed());
    if (selectedPlayer) {
      position.equipo = selectedPlayer.equipo;
      position.name = selectedPlayer.name;
      position.marked = true;
      this.formationCompleted = this.formationPicker?.builder?.isCompleted() ?? false;
    }


  }


  ngOnInit(): void {



    firstValueFrom(this.auth.authState).then(async (user) => {
      if (user && user.email) {
        this.captain = await this.playerService.getPlayerByEmail(user.email);
        this.localImageUrl = await this.teamService.getTeamImageUrl(this.captain.equipo);
        if (!this.captain) {
          return;
        }

        this.loadPlayers(this.captain.equipo);

      }
    });

    this.selectedFormationControl.valueChanges.subscribe(() => this.formationCompleted = false)
  }


}

























