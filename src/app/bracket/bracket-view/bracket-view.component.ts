import { Component, OnInit, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Group, Grouper } from '@app-core/models/group';
import { IMatch } from '@app-core/models/match';
import { MatchService } from '@app-core/services/match.service';

@Component({
  selector: 'app-bracket-view',
  templateUrl: './bracket-view.component.html',
  styleUrls: ['./bracket-view.component.scss']
})
export class BracketViewComponent implements OnInit {

  matchService: MatchService = inject(MatchService);  
  rounds: Group<IMatch>[] = [];

  ngOnInit(): void {
    this.getBracket()
  }

  async getBracket() {
    const matches = await firstValueFrom(this.matchService.getBracket())
    this.rounds = Grouper.groupBy(matches, 'etapa', (a, b) => a.dateTime.getTime() - b.dateTime.getTime());
  }





}