import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ITeam } from 'src/app/models/team';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent {
  teams$: Observable<ITeam[]>;
  lastMatches: number;

  constructor(private teamService: TeamService) {
    this.teams$ = this.teamService.getTeams();
    this.lastMatches = 5;
  }

  getImage(team: ITeam) {
    return `assets/${team.nombre}.png`;
  }
}
