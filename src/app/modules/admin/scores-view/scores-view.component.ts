import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren, inject } from '@angular/core';

import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Observable,  firstValueFrom } from 'rxjs';
import { Group } from '@app-core/models/group';
import { IMatch, Match } from '@app-core/models/match';
import { ITeam } from '@app-core/models/team';
import { MatchService } from '@app-core/services/match.service';
import { TeamService } from '@app-core/services/team.service';
import { ScoreFillerComponent } from '../score-filler/score-filler.component';

import { StandingsViewComponent } from '../standings-view/standings-view.component';
import { MatchComponent } from '@app-shared/components/match/match.component';
import { MatchScrollService } from '@app-core/services/match-scroll.service';

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

  matches: Group<IMatch>[] = [];
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
    // this.matches = await firstValueFrom(matches$);
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

  openStandings() {
    this.bottomSheet.open(StandingsViewComponent, { data: { teams: this.teams, matches: this.matches.map(x => x.values).flat() } });
  }

}
