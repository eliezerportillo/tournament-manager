import { Component, ElementRef, AfterViewInit, QueryList, ViewChildren, OnDestroy } from '@angular/core';
import { Observable, Subscription, firstValueFrom, map, of } from 'rxjs';
import { Group } from 'src/app/models/group';
import { Match } from 'src/app/models/match';
import { MatchService } from 'src/app/services/match.service';
import { MatchComponent } from '../match/match.component';

@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.scss']
})
export class MatchListComponent implements AfterViewInit, OnDestroy {
  matches$: Observable<Group<Match>[]>;

  @ViewChildren(MatchComponent, { read: ElementRef }) matchElements?: QueryList<ElementRef>;
  dataSubscription?: Subscription;


  constructor(private matchService: MatchService) {
    this.matches$ = this.matchService.getMatches().pipe(
      map(this.groupByDate)
    );
  }

  ngAfterViewInit(): void {
    this.dataSubscription = this.matches$.subscribe(async dates => {
      await firstValueFrom(of(this.scrollToCurrentDayElement()));
    });
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  groupByDate(dataArray: Match[]): Group<Match>[] {
    const grouped = dataArray.reduce((groupedData: { [key: string]: Match[] }, data: Match) => {
      const groupKey = data.jornada;
      if (!groupedData[groupKey]) {
        groupedData[groupKey] = [];
      }
      groupedData[groupKey].push(data);
      return groupedData;
    }, {});

    return Object.entries(grouped).map(([key, value]) =>
    (
      { key, values: value.sort((a, b) => a.fecha - b.fecha) }
    )
    );
  }

  private scrollToCurrentDayElement() {

    const currentDate = new Date();
    let closest = this.matchElements?.first; // Initialize with the first date
    let closestDate = new Date(closest?.nativeElement.getAttribute('data-date'));
    let closestDiff = Math.abs(currentDate.getTime() - closestDate.getTime());

    for (const match of this.matchElements ?? []) {
      const elementDate = new Date(match?.nativeElement.getAttribute('data-date'));
      const diff = Math.abs(currentDate.getTime() - elementDate.getTime());
      if (diff < closestDiff) {
        closest = match;
        closestDiff = diff;
      }
    }

    this.scrollToTargetAdjusted(closest?.nativeElement);
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
