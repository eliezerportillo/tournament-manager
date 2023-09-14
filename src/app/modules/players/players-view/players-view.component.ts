import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IPlayer } from '@app-core/models/player';
import { TeamService } from '@app-core/services/team.service';
import { PlayerService } from '@app-core/services/player.service';
import { Observable, firstValueFrom } from 'rxjs';
import { ITeam } from '@app-core/models/team';
import { ModalService } from '@app-core/services/modal.service';
import { PlayerEditorComponent } from '@app-modules/players/player-editor/player-editor.component';
import { LocalStorageKeys } from '@app-core/models/local-storage-keys';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-players-view',
  templateUrl: './players-view.component.html',
  styleUrls: ['./players-view.component.scss']
})
export class PlayersViewComponent implements OnInit {
  bottomSheet: MatBottomSheet = inject(MatBottomSheet);

  playerService = inject(PlayerService);
  teamService = inject(TeamService);
  modalService = inject(ModalService);
  form: FormGroup;
  playersList: PlayerList;
  teams: ITeam[];

  constructor(fb: FormBuilder) {
    this.teams = [];
    this.playersList = {};
    this.form = fb.group(
      {
        teamName: fb.control<string>('')
      }
    );

    this.form.valueChanges.subscribe(value => this.onFormChanges(value));
  }

  getStorageValue(key: LocalStorageKeys): string {
    return localStorage.getItem(key) || '';
  }

  onFormChanges(value: PlayersFilter): void {
    localStorage.setItem(LocalStorageKeys.selectedTeam, value.teamName);
    this.refreshPlayersList(value);
  }

  get teamNameControl() {
    return this.form.get('teamName');
  }

  get teamName() {
    return this.form.value?.teamName;
  }




  get players() {
    return this.playersList[this.teamName];
  }


  refreshPlayersList(filter: PlayersFilter): void {
    this.getPlayers(filter.teamName);
  }

  ngOnInit(): void {
    this.getTeams()
  }

  async getTeams() {
    this.teams = await firstValueFrom(this.teamService.getTeams());
    const lastTeam = this.getStorageValue(LocalStorageKeys.selectedTeam);
    if (lastTeam) {
      this.teamNameControl?.setValue(lastTeam);
    }
  }

  async getPlayers(teamName: string) {
    this.playersList[teamName] = this.playerService.getPlayersByTeam(teamName);
  }

  onSelected(player: IPlayer) {
    this.modalService.open(PlayerEditorComponent, { player: player, isNew: false, team: this.teamName }).subscribe(result => {
      if (result) {

      }
    });
  }

  newPlayer() {
    this.modalService.open(PlayerEditorComponent, { isNew: true, team: this.teamName }).subscribe(result => {
      if (result) {

      }
    });
  }
}

interface PlayerList {
  [teamName: string]: Observable<IPlayer[]>;
}

interface PlayersFilter {
  teamName: string;
}
