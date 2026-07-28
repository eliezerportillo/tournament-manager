import { Component, OnInit, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Group, Grouper } from '@app-core/models/group';
import { IMatch } from '@app-core/models/match';
import { AccountService } from '@app-core/services/account.service';
import { MatchService } from '@app-core/services/match.service';
import { TeamService } from '@app-core/services/team.service';

@Component({
  selector: 'app-bracket-view',
  templateUrl: './bracket-view.component.html',
  styleUrls: ['./bracket-view.component.scss'],
})
export class BracketViewComponent implements OnInit {
  accountService: AccountService = inject(AccountService);
  matchService: MatchService = inject(MatchService);
  teamService: TeamService = inject(TeamService);
  shouldGroupBracket = false;
  groupedBracket: { key: string; rounds: Group<IMatch>[] }[] = [];

  ngOnInit(): void {
    this.getBracket();
  }

  async getBracket() {
    await this.accountService.getTournamentSettings();

    const [matches, teams] = await Promise.all([
      firstValueFrom(this.matchService.getBracket()),
      firstValueFrom(this.teamService.getTeams()),
    ]);

    this.shouldGroupBracket = this.accountService.groupBracket;

    const teamGroupMap: Record<string, string> = {};
    for (const team of teams) {
      teamGroupMap[team.nombre] = team.grupo ?? '';
    }

    const byGroup = this.shouldGroupBracket
      ? matches.reduce(
          (acc, match) => {
            const key =
              teamGroupMap[match.local] ?? teamGroupMap[match.visita] ?? '';
            if (!acc[key]) acc[key] = [];
            acc[key].push(match);
            return acc;
          },
          {} as Record<string, IMatch[]>,
        )
      : { all: matches };

    this.groupedBracket = Object.entries(byGroup)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, groupMatches]) => ({
        key,
        rounds: Grouper.groupBy(
          groupMatches,
          'etapa',
          (a, b) => a.dateTime.getTime() - b.dateTime.getTime(),
        ),
      }));
  }
}
