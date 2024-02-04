import { Component, Input, OnInit, inject } from '@angular/core';
import { LineUp } from '@app-core/models/lineup';
import { Team } from '@app-core/models/team';
import { MatchService } from '@app-core/services/match.service';
import { LineupBase } from '../LineupBase';
import { TeamService } from '@app-core/services/team.service';
import { PlayerService } from '@app-core/services/player.service';
import { IPlayer } from '@app-core/models/player';
import { firstValueFrom, forkJoin, map, tap } from 'rxjs';

@Component({
  selector: 'app-lineup-viewer',
  templateUrl: './lineup-viewer.component.html',
  styleUrls: ['./lineup-viewer.component.scss']
})
export class LineupViewerComponent extends LineupBase implements OnInit {

  private teamService = inject(TeamService);
  private playerService = inject(PlayerService);

  localImageUrl: string = '';
  visitaImageUrl: string = '';

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
    super.loadLineups(this.local, this.visita).then(() => {
      this.loadTeamImages().then(() => {
        this.loadPlayerImages();
      });
    });
  }

  localPlayerImages: { [name: string]: string } = {}
  visitaPlayerImages: { [name: string]: string } = {}

  async loadTeamImages() {
    this.localImageUrl = await this.teamService.getTeamImageUrl(this.local);
    this.visitaImageUrl = await this.teamService.getTeamImageUrl(this.visita);
  }

  async loadPlayerImages() {
    const localPlayerObservables = this.localLineup.map(l => this.playerService.getBadge((l as unknown) as IPlayer));
    const visitaPlayerObservables = this.visitaLineup.map(l => this.playerService.getBadge((l as unknown) as IPlayer));

    if (localPlayerObservables.length > 0) {
      await firstValueFrom(forkJoin(localPlayerObservables).pipe(
        tap(badges => {
          console.log(`${badges.length} local badges read`)
          // Assign the image URLs to the corresponding models
          badges.forEach((badge, index) => {
            if (badge?.playerName) {
              this.localPlayerImages[badge.playerName] = badge.photoUrl
            }
          });
        })
      ));
    }
    if (visitaPlayerObservables.length > 0) {
      await firstValueFrom(forkJoin(visitaPlayerObservables).pipe(
        tap(badges => {
          // Assign the image URLs to the corresponding models
          console.log(`${badges.length} visita badges read`)
          badges.forEach((badge, index) => {
            if (badge?.playerName) {
              this.visitaPlayerImages[badge.playerName] = badge.photoUrl
            }
          });
        })
      ));
    }

  }

  getLocalPlayerPhotoUrl(lineup: LineUp) {
    return this.localPlayerImages[lineup.name] || this.localImageUrl;
  }
  getVisitaPlayerPhotoUrl(lineup: LineUp) {
    return this.visitaPlayerImages[lineup.name] || this.visitaImageUrl;
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
