import { Component, OnInit, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable, OperatorFunction, map } from 'rxjs';
import { Group } from 'src/app/models/group';
import { IMatch } from 'src/app/models/match';
import { ITeam } from 'src/app/models/team';
import { MatchService } from 'src/app/services/match.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-scores-view',
  templateUrl: './scores-view.component.html',
  styleUrls: ['./scores-view.component.scss']
})
export class ScoresViewComponent implements OnInit {

  matchService: MatchService = inject(MatchService);
  teamService: TeamService = inject(TeamService);
  matches: IMatch[] = [];
  teams$?: Observable<ITeam[]>;
  teamControl = new FormControl<ITeam | null>(null);

  ngOnInit(): void {
    this.teams$ = this.teamService.getTeams();

    this.teamControl.valueChanges.pipe(
      map(async team => {
        if (team?.nombre) {
          this.matches = await this.matchService.getMatchesByTeam(team?.nombre);
        }
      })
    )
  }


}
