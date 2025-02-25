import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { SheetPlayer } from '@app-core/models/sheet-player';

@Component({
  selector: 'app-match-sheet-player-list',
  templateUrl: './match-sheet-player-list.component.html',
  styleUrls: ['./match-sheet-player-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class MatchSheetPlayerListComponent implements AfterViewInit {
  displayedColumns: string[] = ['expand', 'number', 'name', 'attended', 'info'];
  dataSource: MatTableDataSource<SheetPlayer>;
  @ViewChild(MatSort) sort?: MatSort;
  expandedElement: SheetPlayer | null;

  constructor() {
    this.expandedElement = null;
    this.dataSource = new MatTableDataSource([] as SheetPlayer[]);
  }

  @Input({ required: true })
  set players(value: SheetPlayer[]) {
    this.dataSource.data = value;
  }

  @Output() onGoalEvent = new EventEmitter<{
    player: SheetPlayer;
    value: number;
  }>();

  @Output() onOwnGoalEvent = new EventEmitter<{
    player: SheetPlayer;
    value: number;
  }>();

  @Output() onAssistEvent = new EventEmitter<{
    player: SheetPlayer;
    value: number;
  }>();
  @Output() onYellowCardEvent = new EventEmitter<{
    player: SheetPlayer;
    value: number;
  }>();
  @Output() onRedCardEvent = new EventEmitter<{
    player: SheetPlayer;
    value: number;
  }>();
  @Output() onAttendanceEvent = new EventEmitter<{
    player: SheetPlayer;
    value: boolean;
  }>();

  ngAfterViewInit() {
    if (this.sort) this.dataSource.sort = this.sort;
  }

  canDecrement(player: SheetPlayer, field: keyof SheetPlayer): boolean {
    return player[field] > 0;
  }

  onAttendance(player: SheetPlayer, value: boolean) {
    this.onAttendanceEvent.emit({ player, value });
  }

  onGoal(player: SheetPlayer, value: number) {
    if (value >= 0 || this.canDecrement(player, 'goles')) {
      this.onGoalEvent.emit({ player, value });
    }
  }

  onOwnGoal(player: SheetPlayer, value: number) {
    if (value >= 0 || this.canDecrement(player, 'autogoles')) {
      this.onOwnGoalEvent.emit({ player, value });
    }
  }

  onAssist(player: SheetPlayer, value: number) {
    if (value >= 0 || this.canDecrement(player, 'asistencias')) {
      this.onAssistEvent.emit({ player, value });
    }
  }

  onYellowCard(player: SheetPlayer, value: number) {
    if (value >= 0 || this.canDecrement(player, 'amarillas')) {
      this.onYellowCardEvent.emit({ player, value });
    }
  }

  onRedCard(player: SheetPlayer, value: number) {
    if (value >= 0 || this.canDecrement(player, 'rojas')) {
      this.onRedCardEvent.emit({ player, value });
    }
  }
}
