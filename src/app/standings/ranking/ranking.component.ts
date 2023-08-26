import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ITeam, Team } from 'src/app/models/team';
import { TeamService } from 'src/app/services/team.service';

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
