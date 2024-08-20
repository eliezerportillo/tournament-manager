import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ITeam } from '@app-core/models/team';
import { TeamService } from '@app-core/services/team.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {

  teams$?: Observable<ITeam[]>;
  groupedTeams: { [key: string]: ITeam[] } = {};


  constructor(private teamService: TeamService) {
  }

  ngOnInit(): void {
    this.teams$ = this.teamService.getRankedTeams().pipe(
      map(teams => {
        this.groupedTeams = this.groupTeamsByGroup(teams);
        return teams;
      })
    );
  }

  private groupTeamsByGroup(teams: ITeam[]): { [key: string]: ITeam[] } {
    return teams.reduce((groups, team) => {
      const group = team.grupo;
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(team);
      return groups;
    }, {} as { [key: string]: ITeam[] });
  }

  get groupKeys(): string[] {
    return Object.keys(this.groupedTeams);
  }

}
