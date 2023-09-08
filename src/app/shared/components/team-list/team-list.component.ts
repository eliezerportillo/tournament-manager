import { Component, Input } from '@angular/core';
import { ITeam, Team } from '@app-core/models/team';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss']
})
export class TeamListComponent {

  @Input()
  teams: ITeam[] = [];
  
  lastMatches = 5;

  getImage(team: ITeam) {
    return Team.createImageUrl(team.nombre);
  }
}
