import { Component, inject, Input } from '@angular/core';
import { StandingColumn } from '@app-core/models/team';
import { ITeamFairPlayPoint } from '@app-core/models/team-fair-play-point';
import { TeamService } from '@app-core/services/team.service';

@Component({
  selector: 'app-team-fair-play-list',
  templateUrl: './team-fair-play-list.component.html',
  styleUrls: ['./team-fair-play-list.component.scss'],
})
export class TeamFairPlayListComponent {
  teamService = inject(TeamService);
  columnsType = StandingColumn;
  teamImages: { [name: string]: string } = {};

  @Input({ required: true })
  teams: ITeamFairPlayPoint[] = [];

  getImage(team: string) {
    return this.teamImages[team];
  }

  ngOnInit(): void {
    this.loadTeamImages();
  }

  async loadTeamImages() {
    for (const team of this.teams) {
      this.teamImages[team.teamName] = await this.teamService.getTeamImageUrl(
        team.teamName
      );
    }
  }
}
