import { Component, Input, OnInit, inject } from '@angular/core';
import { ITeam, StandingColumn, Team } from '@app-core/models/team';
import { TeamService } from '@app-core/services/team.service';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss'],
})
export class TeamListComponent implements OnInit {
  private teamService = inject(TeamService);

  @Input()
  teams: ITeam[] = [];

  lastMatches = 5;

  @Input()
  columns: StandingColumn[];

  columnsType = StandingColumn;

  @Input()
  mode: MatchDisplayType;

  modes = MatchDisplayType;

  constructor() {
    this, (this.mode = MatchDisplayType.table);
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
      StandingColumn.Last,
    ];
  }

  teamImages: { [name: string]: string } = {};
  ngOnInit(): void {
    this.loadTeamImages();
  }

  async loadTeamImages() {
    for (const team of this.teams) {
      this.teamImages[team.nombre] = await this.teamService.getTeamImageUrl(
        team.nombre
      );
    }
  }

  getImage(team: ITeam) {
    return this.teamImages[team.nombre];
  }

  // Función para determinar si una fila debe ser resaltada
  highlightedType(element: ITeam): string {
    // Cambia este código según tus criterios para resaltar las primeras 8 filas

    switch (this.teams.indexOf(element)) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        return 'highlighted-passed';
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
        return 'highlighted-passed-2';
      default:
        return 'highlighted-not-passed';
    }
  }
}

export enum MatchDisplayType {
  table = 'table',
  widget = 'widget',
}
