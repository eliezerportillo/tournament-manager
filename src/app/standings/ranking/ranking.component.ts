import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Team } from 'src/app/models/team';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent {
  teams$: Observable<Team[]>;

  constructor(private teamService: TeamService) {
    this.teams$ = this.teamService.getTeams();
  }

  getImage(team: Team) {
    return `assets/${team.nombre}.png`;
  }
}
