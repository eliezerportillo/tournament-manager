import {
  Component,
  ElementRef,
  AfterViewInit,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { Group, Grouper } from '@app-core/models/group';
import { IMatch, Match } from '@app-core/models/match';
import { MatchService } from '@app-core/services/match.service';
import { MatchComponent } from '@app-shared/components/match/match.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchScrollService } from '@app-core/services/match-scroll.service';
import { MatchStandingComponent } from '../match-standing/match-standing.component';

@Component({
  selector: 'app-matches-view',
  templateUrl: './matches-view.component.html',
  styleUrls: ['./matches-view.component.scss'],
})
export class MatchesViewComponent implements AfterViewInit {
  router: Router = inject(Router);
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  scrollService: MatchScrollService = inject(MatchScrollService);
  matches$?: Observable<Group<IMatch>[]>;

  @ViewChildren(MatchStandingComponent, { read: ElementRef })
  matchElements?: QueryList<ElementRef>;
  selectedDate?: Date;
  constructor(private matchService: MatchService) {}

  ngAfterViewInit(): void {
    this.matchElements?.changes.subscribe((dates) => {
      this.scrollService.scrollToCurrentDayElement(
        this.matchElements?.toArray() ?? []
      );
    });
  }

  async loadMatchesByDate(date: Date) {
    this.selectedDate = date;
    const matches = await this.matchService.getMatchesByDate(date);
    this.matches$ = of(Grouper.groupBy(matches, 'fecha'));
  }

  onSelected(match: IMatch) {
    if (Match.noPlay(match)) return;
    this.router.navigate(['view'], {
      relativeTo: this.activatedRoute,
      queryParams: { local: match.local, visita: match.visita },
    });
  }

  isSame(match: IMatch): boolean {
    return Match.isSame(match);
  }

  isToday(): boolean {
    if (!this.selectedDate) return false;
    return (
      new Date(this.selectedDate).toDateString() === new Date().toDateString()
    );
  }
}
