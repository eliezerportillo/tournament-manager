import { Component, ElementRef, AfterViewInit, QueryList, ViewChildren, OnDestroy, inject } from '@angular/core';
import { Observable, Subscription, map, shareReplay, tap } from 'rxjs';
import { Group } from 'src/app/models/group';
import { IMatch, Match } from 'src/app/models/match';
import { MatchService } from 'src/app/services/match.service';
import { MatchComponent } from '../../shared/components/match/match.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchScrollService } from 'src/app/services/match-scroll.service';

@Component({
  selector: 'app-matches-view',
  templateUrl: './matches-view.component.html',
  styleUrls: ['./matches-view.component.scss']
})
export class MatchesViewComponent implements AfterViewInit {
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  scrollService: MatchScrollService = inject(MatchScrollService);
  matches$: Observable<Group<IMatch>[]>;

  @ViewChildren(MatchComponent, { read: ElementRef }) matchElements?: QueryList<ElementRef>;

  constructor(private matchService: MatchService) {
    this.matches$ = this.matchService.getMatchesGroupedByDate();
  }

  ngAfterViewInit(): void {
    this.matchElements?.changes.subscribe(dates => {
      this.scrollService.scrollToCurrentDayElement(this.matchElements?.toArray() ?? []);
    });
  }

  onSelected(match: IMatch) {
    if (Match.noPlay(match)) return;
    this.router.navigate(['view'], { relativeTo: this.route, queryParams: { local: match.local, visita: match.visita } });
  }
}
