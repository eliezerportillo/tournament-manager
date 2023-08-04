import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LineupBase } from 'src/app/matches/Lineup/LineupBase';
import { LineUp } from 'src/app/models/lineup';
import { Team } from 'src/app/models/team';
import { MatchService } from 'src/app/services/match.service';

@Component({
  selector: 'app-upload-lineup',
  templateUrl: './upload-lineup.component.html',
  styleUrls: ['./upload-lineup.component.scss']
})
export class UploadLineupComponent extends LineupBase implements OnInit {

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
    return lineup.find(x => x.portero);
  }

  getDefenses(lineup: LineUp[]) {
    return lineup.filter(x => !x.portero && x.titular).slice(0, 3);
  }

  getMidfielder(lineup: LineUp[]) {
    return lineup.filter(x => !x.portero && x.titular).slice(3, 4);
  }

  getStriker(lineup: LineUp[]) {
    return lineup.filter(x => !x.portero && x.titular).slice(4);
  }


  ngOnInit(): void {
    super.loadLineups(this.local, this.visita);
  }

}
