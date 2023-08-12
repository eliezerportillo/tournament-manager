import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Group } from 'src/app/models/group';
import { Match } from 'src/app/models/match';
import { MatchService } from 'src/app/services/match.service';

@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.scss']
})
export class MatchListComponent {
  matches$: Observable<Group<Match>[]>;



  constructor(private matchService: MatchService) {
    this.matches$ = this.matchService.getMatches().pipe(
      map(this.groupByDate)
    );
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
}
