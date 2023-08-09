import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LineupBase } from 'src/app/matches/lineup/LineupBase';
import { LineUp } from 'src/app/models/lineup';
import { Team } from 'src/app/models/team';
import { MatchService } from 'src/app/services/match.service';

@Component({
  selector: 'app-lineup-viewer',
  templateUrl: './lineup-viewer.component.html',
  styleUrls: ['./lineup-viewer.component.scss']
})
export class LineupViewerComponent extends LineupBase implements OnInit {

  constructor(matchService: MatchService) {
    super(matchService);
    this.editable = false;
    this.local = '';
    this.visita = '';
  }


  @Input()
  editable: boolean;

  @Input() local: string;
  @Input() visita: string;

  get localImageUrl(): string {
    return Team.createImageUrl(this.local)
  }

  get visitaImageUrl(): string {
    return Team.createImageUrl(this.visita)
  }

  getPortero(lineup: LineUp[]) {
    return lineup.find(x => x.playerType == 'portero');
  }

  getDefenses(lineup: LineUp[]) {
    return lineup.filter(x => x.playerType == 'defensa')
  }

  getMidfielder(lineup: LineUp[]) {
    return lineup.filter(x => x.playerType == 'medio')
  }

  getStriker(lineup: LineUp[]) {
    return lineup.filter(x => x.playerType == 'delantero')
  }
  


  ngOnInit(): void {
    super.loadLineups(this.local, this.visita);
  }

}
