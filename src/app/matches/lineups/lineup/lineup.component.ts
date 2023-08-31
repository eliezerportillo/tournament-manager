import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IMatch } from 'src/app/models/match';
import { MatchService } from 'src/app/services/match.service';

@Component({
  selector: 'app-lineup',
  templateUrl: './lineup.component.html',
  styleUrls: ['./lineup.component.scss']
})
export class LineupComponent implements OnInit {

  local: string;
  visita: string;

  match?: IMatch;
  

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
