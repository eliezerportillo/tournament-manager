import { Component, ElementRef, AfterViewInit, QueryList, ViewChildren, OnDestroy, inject } from '@angular/core';
import { Observable, Subscription, map, shareReplay, tap } from 'rxjs';
import { Group } from 'src/app/models/group';
import { IMatch, Match } from 'src/app/models/match';
import { MatchService } from 'src/app/services/match.service';
import { MatchComponent } from '../../shared/components/match/match.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-matches-view',
  templateUrl: './matches-view.component.html',
  styleUrls: ['./matches-view.component.scss']
})
export class MatchesViewComponent implements AfterViewInit {
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  matches$: Observable<Group<IMatch>[]>;

  @ViewChildren(MatchComponent, { read: ElementRef }) matchElements?: QueryList<ElementRef>;

  constructor(private matchService: MatchService) {
    this.matches$ = this.matchService.getMatchesGroupedByStage();
  }

  ngAfterViewInit(): void {
    this.matchElements?.changes.subscribe(dates => {
      this.scrollToCurrentDayElement()
    });
  }

  onSelected(match: IMatch) {
    this.router.navigate(['view'], { relativeTo: this.route, queryParams: { local: match.local, visita: match.visita } });
  }

  private scrollToCurrentDayElement() {

    const currentDate = new Date();
    let closest = this.matchElements?.first; // Initialize with the first date
    let closestDate = new Date(closest?.nativeElement.getAttribute('data-date'));
    let closestDiff = Math.abs(currentDate.getTime() - closestDate.getTime());

    for (const match of this.matchElements ?? []) {
      const elementDate = new Date(match?.nativeElement.getAttribute('data-date'));
      const diff = Math.abs(currentDate.getTime() - elementDate.getTime());
      if (!Match.isFinished(elementDate) && diff < closestDiff) {
        closest = match;
        closestDiff = diff;
      }
    }

    if (closest?.nativeElement) {
      this.scrollToTargetAdjusted(closest?.nativeElement);
    }
  }

  private scrollToTargetAdjusted(element: any) {
    var headerOffset = 55;
    var elementPosition = element.getBoundingClientRect().top;
    var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "auto"
    });
  }
}
