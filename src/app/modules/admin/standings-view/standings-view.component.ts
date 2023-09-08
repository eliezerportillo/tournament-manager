import { Component, Inject, OnInit, inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { IMatch } from '@app-core/models/match';
import { ITeam } from '@app-core/models/team';
import { UpdateStandingsCommand } from '@app-core/services/update-standings.command';

@Component({
  selector: 'app-standings-view',
  templateUrl: './standings-view.component.html',
  styleUrls: ['./standings-view.component.scss']
})
export class StandingsViewComponent implements OnInit {
  title: string;
  hasChanges = false;
  processing = false;
  teams: ITeam[];
  updateStandingsCommand: UpdateStandingsCommand = inject(UpdateStandingsCommand);
  bottomSheetRef: MatBottomSheetRef<StandingsViewComponent> = inject(MatBottomSheetRef<StandingsViewComponent>);
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: { teams: ITeam[], matches: IMatch[] }) {
    this.title = `Posiciones`;
    this.teams = JSON.parse(JSON.stringify(data.teams));
  }

  ngOnInit(): void {
    this.checkChanges();
  }

  get disabledProcess() {
    return this.processing || !this.hasChanges;
  }
  checkChanges() {
    const oldPoints = this.teams.reduce((acc, item) => acc += item.Pts, 0);
    const kardex = this.updateStandingsCommand.calcKardex(this.data.matches, this.teams);
    const newPoints = kardex.reduce((acc, item) => acc += item.Pts, 0);
    this.hasChanges = oldPoints != newPoints;
  }

  close() {
    this.bottomSheetRef.dismiss();
  }

  async process() {
    this.processing = true;
    this.teams = await this.updateStandingsCommand.execute(this.data.matches, this.data.teams);
    this.processing = false;
  }
}
