import { Component, Input, OnInit, inject } from '@angular/core';
import { IMatch } from '@app-core/models/match';
import { ITeam } from '@app-core/models/team';
import { TeamService } from '@app-core/services/team.service';

@Component({
  selector: 'app-match-standing',
  templateUrl: './match-standing.component.html',
  styleUrls: ['./match-standing.component.scss']
})
export class MatchStandingComponent implements OnInit {

  teamService = inject(TeamService);
  teams: ITeam[] = [];

  @Input()
  match?: IMatch;


  ngOnInit(): void {
    this.getStandings();
  }

  

  private async getStandings() {
    if (this.match) {
      const home = this.teamService.getTeam(this.match.local);
      const away = this.teamService.getTeam(this.match.visita);

      this.teams = await Promise.all([home, away]);
    }
  }
}
