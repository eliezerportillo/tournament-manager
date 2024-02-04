import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IMatch, Match } from '@app-core/models/match';
import { AccountService } from '@app-core/services/account.service';
import { MatchService } from '@app-core/services/match.service';

@Component({
  selector: 'app-lineup',
  templateUrl: './lineup.component.html',
  styleUrls: ['./lineup.component.scss']
})
export class LineupComponent implements OnInit {

  local: string;
  visita: string;

  match?: IMatch;
  accountService = inject(AccountService)

  constructor(private route: ActivatedRoute, private matchService: MatchService) {

    this.local = '';
    this.visita = '';
  }

  get title() { return this.accountService.getTournamentName() }

  ngOnInit(): void {
    // Access the URL parameters here

    this.route.queryParams.subscribe(params => {
      // Get the value of a specific parameter by its name
      this.local = params['local'] ?? '';
      this.visita = params['visita'] ?? '';
      this.loadMatch();
    });


  }

  
  isFinished(match: IMatch): boolean {
    return Match.isFinished(match.dateTime);
  }

  async share(match: IMatch) {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${match.local} vs ${match.visita}. Campo ${match.campo}. ${match.dateTime}`,
          text: `${match.local} vs ${match.visita}. Campo ${match.campo}. ${match.dateTime}`,
          url: window.location.href
        });
      } else {
        window.open(window.location.href);
      }
    } catch (error) {
      console.error('Error sharing content:', error);
    }
  }

  private async loadMatch() {
    this.match = await this.matchService.getMatch(this.local, this.visita);
  }
}
