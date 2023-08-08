import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LineUp } from 'src/app/models/lineup';
import { Match } from 'src/app/models/match';
import { Team } from 'src/app/models/team';
import { MatchService } from 'src/app/services/match.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-lineup',
  templateUrl: './lineup.component.html',
  styleUrls: ['./lineup.component.scss']
})
export class LineupComponent implements OnInit {

  local: string;
  visita: string;

  match?: Match;

  constructor(private route: ActivatedRoute, private matchService: MatchService) {

    this.local = '';
    this.visita = '';
  }

  ngOnInit(): void {
    // Access the URL parameters here

    this.route.queryParams.subscribe(params => {
      // Get the value of a specific parameter by its name
      this.local = params['local'] ?? '';
      this.visita = params['visita'] ?? '';
      this.loadMatch();
    });


  }

  private async loadMatch() {
    this.match = await this.matchService.getMatch(this.local, this.visita);
  }
}
