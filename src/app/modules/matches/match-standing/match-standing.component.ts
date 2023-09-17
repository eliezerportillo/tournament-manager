import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { IMatch, Match } from '@app-core/models/match';
import { ITeam, StandingColumn } from '@app-core/models/team';
import { TeamService } from '@app-core/services/team.service';
import { MatchDisplayType } from '@app-shared/components/team-list/team-list.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-match-standing',
  templateUrl: './match-standing.component.html',
  styleUrls: ['./match-standing.component.scss']
})
export class MatchStandingComponent implements OnInit {

  teamService = inject(TeamService);
  teams: ITeam[] = [];
  mode = MatchDisplayType.widget;

  @Input()
  match?: IMatch;
  columns: StandingColumn[];

  @Output()
  selected: EventEmitter<IMatch> = new EventEmitter<IMatch>()

  select(event: IMatch) {
    this.selected.emit(event);
  }

  noPlay(match: IMatch): boolean {
    return Match.noPlay(match);
  }

  isFinished(match: IMatch): boolean {
    return Match.isFinished(match.dateTime);
  }

  constructor() {
    this.columns = [
      StandingColumn.Team,
      StandingColumn.Wins,
      StandingColumn.Draws,
      StandingColumn.Losses,
      StandingColumn.Points
    ]
  }


  ngOnInit(): void {
    this.getStandings();
  }



  private async getStandings() {
    const teams = await firstValueFrom(this.teamService.getTeams());
    if (this.match) {     
      this.teams = teams.filter(x => x.nombre == this.match?.local || x.nombre == this.match?.visita).sort((a, b) => b.Pts - a.Pts);
    }
  }
}
