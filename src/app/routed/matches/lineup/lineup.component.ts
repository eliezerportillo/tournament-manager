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
  localLineup: LineUp[];
  visitaLineup: LineUp[];
  local: any;
  visita: any;
  match?: Match;


  constructor(private route: ActivatedRoute, private teamService: TeamService, private matchService: MatchService) {
    this.localLineup = [];
    this.visitaLineup = [];
  }

  ngOnInit(): void {
    // Access the URL parameters here

    this.route.queryParams.subscribe(params => {
      // Get the value of a specific parameter by its name
      this.local = params['local'] ?? '';
      this.visita = params['visita'] ?? '';

      this.getLineups(this.local, this.visita);
    });


  }

  get localStarting () {
    return this.localLineup.filter(x => x.titular ? true : false);
  }

  get localSubstitutes() {
    return this.localLineup.filter(x => x.titular == undefined || x.titular == false);
  }

  get visitaStarting () {
    return this.visitaLineup.filter(x => x.titular ? true : false);
  }

  get visitaSubstitutes() {
    return this.visitaLineup.filter(x => x.titular == undefined || x.titular == false);
  }

  get localImageUrl(): string {
    return this.match?.imageUrlLocal ?? '';
  }

  get visitaImageUrl(): string {
    return this.match?.imageUrlVisita ?? '';
  }

  async getLineups(local: string, visita: string) {

    const promises = [
      this.matchService.getMatch(local, visita),
      this.matchService.getLineup(local),
      this.matchService.getLineup(visita)
    ];

    const responses = await Promise.all(promises);

    this.match = responses[0] as Match;
    this.localLineup = responses[1] as LineUp[];
    this.visitaLineup = responses[2] as LineUp[];

  }
}
