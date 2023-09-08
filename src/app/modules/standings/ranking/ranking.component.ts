import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ITeam } from '@app-core/models/team';
import { TeamService } from '@app-core/services/team.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {
  
  teams$?: Observable<ITeam[]>;


  constructor(private teamService: TeamService) {
  }
  
  ngOnInit(): void {
    this.teams$ = this.teamService.getRankedTeams();
  }

}
