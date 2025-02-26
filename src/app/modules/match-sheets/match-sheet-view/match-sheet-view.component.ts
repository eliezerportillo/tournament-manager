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
  loading = false;
  constructor(private matchesService: MatchService) {}
  dateISO: string = '';

  ngOnInit(): void {}

  get matches(): IMatch[] {
    return this.matchesByDate[this.dateISO] || [];
  }

  async getMatchesByDate(date: Date) {
    this.dateISO = date.toISOString().split('T')[0];
    if (!this.matchesByDate[this.dateISO]) {
      const matches = await this.matchesService.getMatchesByDate(date);
      this.matchesByDate[this.dateISO] = matches;
    }
  }

  onMatchSelected(match: IMatch): void {
    this.router.navigate(['view'], {
      relativeTo: this.activatedRoute,
      queryParams: { local: match.local, visita: match.visita },
    });
  }
}
