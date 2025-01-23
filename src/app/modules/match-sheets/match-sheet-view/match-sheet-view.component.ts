import { Component, inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IMatch } from '@app-core/models/match';
import { MatchService } from '@app-core/services/match.service';
import { Observable, of, tap } from 'rxjs';


@Component({
  selector: 'app-match-sheet-view',
  templateUrl: './match-sheet-view.component.html',
  styleUrls: ['./match-sheet-view.component.scss']
})
export class MatchSheetViewComponent implements OnInit {
  nextMatches$: Observable<IMatch[]>;
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  router = inject(Router);
  constructor(private matchesService: MatchService) {
    this.nextMatches$ = this.loadMatches();
  }

  ngOnInit(): void {

  }

  loadMatches(): Observable<IMatch[]> {
    const storedMatches = localStorage.getItem('nextMatches');
    const lastReadMatchesDate = localStorage.getItem('lastReadMatchesDate');
    const currentDate = new Date().toISOString().split('T')[0];

    if (storedMatches && lastReadMatchesDate && currentDate < lastReadMatchesDate) {
      return of(JSON.parse(storedMatches));
    } else {
      return this.matchesService.getNextMatches().pipe(
        tap(matches => {
          localStorage.setItem('nextMatches', JSON.stringify(matches));
          localStorage.setItem('lastReadMatchesDate', currentDate);
        })
      );
    }
  }

  onMatchSelected(match: IMatch): void {    
    this.router.navigate(['view'], { relativeTo: this.activatedRoute, queryParams: { local: match.local, visita: match.visita } });
  }
}

