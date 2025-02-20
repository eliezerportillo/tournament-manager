import { Component, inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IMatch } from '@app-core/models/match';
import { MatchService } from '@app-core/services/match.service';
import { Observable, of, tap } from 'rxjs';

@Component({
  selector: 'app-match-sheet-view',
  templateUrl: './match-sheet-view.component.html',
  styleUrls: ['./match-sheet-view.component.scss'],
})
export class MatchSheetViewComponent implements OnInit {
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  router = inject(Router);
  matchesByDate: { [key: string]: IMatch[] } = {};
  dateControl: FormControl = new FormControl({
    value: new Date(),
    disabled: true,
  });

  loading = false;
  constructor(private matchesService: MatchService) {}

  ngOnInit(): void {
    const lastSelectedDate = localStorage.getItem('matches-selectedDate');
    if (lastSelectedDate) {
      this.dateControl.setValue(new Date(lastSelectedDate));
    }
    // const matchesByDate = storedMatches ? JSON.parse(storedMatches) : {};
    // this.matchesByDate = matchesByDate;

    this.dateControl.valueChanges
      .pipe(tap((date) => this.getMatchesByDate(date)))
      .subscribe();

    this.getMatchesByDate(this.dateControl.value);
  }

  get matches(): IMatch[] {
    return (
      this.matchesByDate[this.dateControl.value.toISOString().split('T')[0]] ||
      []
    );
  }

  async getMatchesByDate(date: Date) {
    const dateString = date.toISOString();
    localStorage.setItem('matches-selectedDate', dateString);
    const dateISO = date.toISOString().split('T')[0];

    if (!this.matchesByDate[dateISO]) {
      const matches = await this.matchesService.getMatchesByDate(date);
      this.matchesByDate[dateISO] = matches;
      // localStorage.setItem('matchesByDate', JSON.stringify(this.matchesByDate));
    }
  }

  onMatchSelected(match: IMatch): void {
    this.router.navigate(['view'], {
      relativeTo: this.activatedRoute,
      queryParams: { local: match.local, visita: match.visita },
    });
  }
}
