import { Component, Input } from '@angular/core';
import { ITeam, StandingColumn, Team } from '@app-core/models/team';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss']
})
export class TeamListComponent {

  @Input()
  teams: ITeam[] = [];

  lastMatches = 5;

  @Input()
  columns: StandingColumn[];

  columnsType = StandingColumn;

  @Input()
  mode: MatchDisplayType;

  constructor() {
    this, this.mode = MatchDisplayType.table;
    this.columns = [
      StandingColumn.Team,
      StandingColumn.MatchesPlayed,
      StandingColumn.Wins,
      StandingColumn.Draws,
      StandingColumn.Losses,
      StandingColumn.Goals,
      StandingColumn.GoalsConsided,
      StandingColumn.GoalDif,
      StandingColumn.Points,
      StandingColumn.Last
    ];

  }

  getImage(team: ITeam) {
    return Team.createImageUrl(team.nombre);
  }
}

enum MatchDisplayType {
  table,
  widget
}
