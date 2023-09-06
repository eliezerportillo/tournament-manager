import { Component, Input, OnInit } from '@angular/core';
import { MatchResult } from 'src/app/models/match';
import { MatchService } from 'src/app/services/match.service';



@Component({
  selector: 'app-last-matches',
  templateUrl: './last-matches.component.html',
  styleUrls: ['./last-matches.component.scss']
})
export class LastMatchesComponent implements OnInit {

  @Input()
  lastMatches = 0;

  @Input()
  team: string;


  lastResults: string[];

  constructor(private matchService: MatchService) {
    this.team = '';

    this.lastResults = [];
  }

  ngOnInit(): void {
    this.lastResults = Array(this.lastMatches).fill('', 0, this.lastMatches);
    this.loadLastMatches();
  }


  private async loadLastMatches() {
    const matches = await this.matchService.getLastMatchesByTeam(this.team, this.lastMatches);

    // Step 1: Sort the array by date in descending order (most recent first)
    const matchResults = matches.map(m => new MatchResult(m));
    const lastResults: string[] = matchResults.map(match => {
      return match.winner == this.team ? 'win' : match.draw ? 'draw' : match.played ? 'loss' : '';
    });

    this.lastResults = Array.of(...lastResults, ...this.lastResults).slice(0, this.lastMatches);
  }
}
