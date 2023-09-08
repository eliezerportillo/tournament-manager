import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren, inject } from '@angular/core';

import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Observable,  firstValueFrom } from 'rxjs';
import { Group } from 'src/app/models/group';
import { IMatch, Match } from 'src/app/models/match';
import { ITeam } from 'src/app/models/team';
import { MatchService } from 'src/app/services/match.service';
import { TeamService } from 'src/app/services/team.service';
import { ScoreFillerComponent } from '../score-filler/score-filler.component';

import { StandingsViewComponent } from '../standings-view/standings-view.component';
import { MatchComponent } from 'src/app/shared/components/match/match.component';
import { MatchScrollService } from 'src/app/services/match-scroll.service';

@Component({
  selector: 'app-scores-view',
  templateUrl: './scores-view.component.html',
  styleUrls: ['./scores-view.component.scss']
})
export class ScoresViewComponent implements OnInit, AfterViewInit {

  bottomSheet: MatBottomSheet = inject(MatBottomSheet);
  matchService: MatchService = inject(MatchService);
  teamService: TeamService = inject(TeamService);
  scrollService: MatchScrollService = inject(MatchScrollService);

  teams: ITeam[] = [];
  
  matches$?: Observable<Group<IMatch>[]>;
  @ViewChildren(MatchComponent, { read: ElementRef }) matchElements?: QueryList<ElementRef>;

  ngOnInit(): void {

    this.load();


  }

  ngAfterViewInit(): void {
    this.matchElements?.changes.subscribe(() => {
      this.scrollService.scrollToCurrentDayElement(this.matchElements?.toArray() ?? []);
    });
  }

  async load() {
    this.matches$ = this.matchService.getMatchesGroupedByDate();
    
    this.teams = await firstValueFrom(this.teamService.getRankedTeams());
  }


  async onSelected(match: IMatch) {
    if (Match.noPlay(match)) return;

    const ref = this.bottomSheet.open(ScoreFillerComponent, { data: { match }, disableClose: true });
    const changed: IMatch = await firstValueFrom(ref.afterDismissed());
    if (changed) {
      // match = changed;
    }
  }

  openStandings(matches: Group<IMatch>[]) {
    this.bottomSheet.open(StandingsViewComponent, { data: { teams: this.teams, matches: matches.map(x => x.values).flat() } });
  }

}
