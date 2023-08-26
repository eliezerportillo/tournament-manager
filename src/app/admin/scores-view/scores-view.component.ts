import { Component, OnInit, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Observable, OperatorFunction, firstValueFrom, map } from 'rxjs';
import { Group } from 'src/app/models/group';
import { IMatch, MatchResult } from 'src/app/models/match';
import { ITeam } from 'src/app/models/team';
import { MatchService } from 'src/app/services/match.service';
import { TeamService } from 'src/app/services/team.service';
import { ScoreFillerComponent } from '../score-filler/score-filler.component';
import { UpdateStandingsCommand } from 'src/app/services/update-standings.command';
import { StandingsViewComponent } from '../standings-view/standings-view.component';

@Component({
  selector: 'app-scores-view',
  templateUrl: './scores-view.component.html',
  styleUrls: ['./scores-view.component.scss']
})
export class ScoresViewComponent implements OnInit {

  bottomSheet: MatBottomSheet = inject(MatBottomSheet);
  matchService: MatchService = inject(MatchService);
  teamService: TeamService = inject(TeamService);

  teams: ITeam[] = [];

  matches: Group<IMatch>[] = [];


  ngOnInit(): void {

    this.load();


  }

  async load() {
    this.matches = await firstValueFrom(this.matchService.getMatchesGroupedByStage());
    this.teams = await firstValueFrom(this.teamService.getRankedTeams());
  }


  async onSelected(match: IMatch) {
    const ref = this.bottomSheet.open(ScoreFillerComponent, { data: { match }, disableClose: true });
    const scoreChanged: boolean = await firstValueFrom(ref.afterDismissed());
    if (scoreChanged) {

    }
  }

  openStandings() {
    const ref = this.bottomSheet.open(StandingsViewComponent, { data: { teams: this.teams, matches: this.matches.map(x => x.values).flat() } });
  }

}
