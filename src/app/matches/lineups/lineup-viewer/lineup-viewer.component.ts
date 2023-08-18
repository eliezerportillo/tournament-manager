import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Group } from 'src/app/models/group';
import { LineUp } from 'src/app/models/lineup';
import { Team } from 'src/app/models/team';
import { MatchService } from 'src/app/services/match.service';
import { LineupBase } from '../LineupBase';

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

  getFormation(lineup: LineUp[], home: boolean) {

    const g = this.group<LineUp>('playerType', lineup.filter(p => p.startging), (a, b) => a.order - b.order);
    if (!home) {
      return g.reverse()
    }

    return g;

  }

  ngOnInit(): void {
    super.loadLineups(this.local, this.visita);
  }

  group<T>(key: string, dataArray: T[], sort?: (a: T, b: T) => number) {
    const grouped = dataArray.reduce((groupedData: { [key: string]: T[] }, data: T) => {
      const groupKey: string = (data as any)[key];
      if (!groupedData[groupKey]) {
        groupedData[groupKey] = [];
      }
      groupedData[groupKey].push(data);
      return groupedData;
    }, {});


    return Object.entries(grouped).map(([key, value]) =>
    (
      { key, values: sort ? value.sort(sort) : value }
    )
    );
  }

}
