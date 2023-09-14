import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Group } from '@app-core/models/group';
import { IMatch, Match } from '@app-core/models/match';
import { SharedModule } from '@app-shared/shared.module';
import { PlayerAvatarComponent } from '../player-avatar/player-avatar.component';
import { MatIconModule } from '@angular/material/icon';
import { BadgeStatusComponent } from '../badge-status/badge-status.component';

@Component({
  selector: 'app-match-table-info',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    SharedModule, // 👈 super bad imports.
    PlayerAvatarComponent,
    MatIconModule,
    BadgeStatusComponent,
  ],
  templateUrl: './match-table-info.component.html',
  styleUrls: ['./match-table-info.component.scss'],
})
export class MatchTableInfoComponent {
  displayedColumns: string[] = ['local', 'scoring', 'visita', 'details'];
  dataSource!: MatTableDataSource<IMatch>;

  private _match!: Group<IMatch>;

  @Input() showHeaders = false;

  @Input()
  public get match() {
    return this._match;
  }

  public set match(match: Group<IMatch>) {
    this._match = match;
    const mapDataValues = this._match.values.map((value) => ({
      ...value,
      scoring: !value?.marcadorLocal
        ? null
        : `${value?.marcadorLocal} - ${value?.marcadorVisita}`,
    }));

    this.dataSource = new MatTableDataSource(mapDataValues) as any;
  }

  noPlay(match: IMatch): boolean {
    return Match.noPlay(match);
  }

  isFinished(match: IMatch): boolean {
    return Match.isFinished(match.dateTime);
  }
}
