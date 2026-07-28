import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Stats } from '@app-core/models/stats';
import { IPlayer } from '@app-core/models/player';
import { AccountService } from '@app-core/services/account.service';
import { PlayerService } from '@app-core/services/player.service';
import { TeamService } from '@app-core/services/team.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {
  constructor(
    private accountService: AccountService,
    private playerService: PlayerService,
    private teamService: TeamService,
  ) {}

  groupedStats: { [group: string]: Stats } = {};
  groupKeys: string[] = [];
  shouldGroupStats = false;

  ngOnInit(): void {
    this.getStats();
  }

  private async getStats() {
    await this.accountService.getTournamentSettings();

    const [stats, teams] = await Promise.all([
      this.playerService.getPlayersStats(),
      firstValueFrom(this.teamService.getTeams()),
    ]);

    this.shouldGroupStats = this.accountService.groupStats;

    const teamGroupMap: Record<string, string> = {};
    for (const team of teams) {
      teamGroupMap[team.nombre] = team.grupo ?? '';
    }

    const partition = (players: IPlayer[]): Record<string, IPlayer[]> =>
      players.reduce(
        (acc, player) => {
          const group = teamGroupMap[player.equipo] ?? '';
          if (!acc[group]) acc[group] = [];
          acc[group].push(player);
          return acc;
        },
        {} as Record<string, IPlayer[]>,
      );

    const goalsByGroup = this.shouldGroupStats
      ? partition(stats.goals)
      : { all: stats.goals };
    const yellowsByGroup = this.shouldGroupStats
      ? partition(stats.yellows)
      : { all: stats.yellows };
    const redsByGroup = this.shouldGroupStats
      ? partition(stats.reds)
      : { all: stats.reds };
    const faultsByGroup = this.shouldGroupStats
      ? partition(stats.faults)
      : { all: stats.faults };
    const assistsByGroup = this.shouldGroupStats
      ? partition(stats.assists)
      : { all: stats.assists };

    const allGroups = this.shouldGroupStats
      ? Array.from(new Set(teams.map((t) => t.grupo ?? ''))).sort()
      : ['all'];

    const grouped: { [group: string]: Stats } = {};
    for (const group of allGroups) {
      grouped[group] = {
        goals: goalsByGroup[group] ?? [],
        yellows: yellowsByGroup[group] ?? [],
        reds: redsByGroup[group] ?? [],
        faults: faultsByGroup[group] ?? [],
        assists: assistsByGroup[group] ?? [],
      };
    }

    this.groupedStats = grouped;
    this.groupKeys = allGroups;
  }
}
