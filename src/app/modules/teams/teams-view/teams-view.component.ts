import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { ITeam, Team } from '@app-core/models/team';
import { TeamService } from '@app-core/services/team.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-teams-view',
  standalone: true,
  imports: [CommonModule, MatListModule, MatRippleModule, FlexLayoutModule, MatButtonModule],
  templateUrl: './teams-view.component.html',
  styleUrl: './teams-view.component.scss'
})
export class TeamsViewComponent implements OnInit {
  
  // teamService = inject(TeamService);
  teams$?: Observable<ITeam[]>;

  ngOnInit(): void {
    // this.teams$ = this.teamService.getTeams();
  }

  getTeamImageUrl(team: ITeam){
    return Team.createImageUrl(team.nombre)
  }
}
