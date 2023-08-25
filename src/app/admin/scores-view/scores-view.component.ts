import { Component, OnInit, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Observable, OperatorFunction, firstValueFrom, map } from 'rxjs';
import { Group } from 'src/app/models/group';
import { IMatch } from 'src/app/models/match';
import { ITeam } from 'src/app/models/team';
import { MatchService } from 'src/app/services/match.service';
import { TeamService } from 'src/app/services/team.service';
import { ScoreFillerComponent } from '../score-filler/score-filler.component';

@Component({
  selector: 'app-scores-view',
  templateUrl: './scores-view.component.html',
  styleUrls: ['./scores-view.component.scss']
})
export class ScoresViewComponent implements OnInit {

  bottomSheet: MatBottomSheet = inject(MatBottomSheet);
  matchService: MatchService = inject(MatchService);
  teamService: TeamService = inject(TeamService);
  matches: IMatch[] = [];
  teams$?: Observable<ITeam[]>;
  
  matches$?: Observable<Group<IMatch>[]>;


  ngOnInit(): void {    
    

    this.matches$ = this.matchService.getMatchesGroupedByStage();

  }


  async onSelected(match: IMatch) {
    const ref = this.bottomSheet.open(ScoreFillerComponent, { data: { match } });
    const result: IMatch | undefined = await firstValueFrom(ref.afterDismissed());
    if (result) {

    }
  }


}
