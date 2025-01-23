import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';
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
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MatchSheetPlayerListComponent implements AfterViewInit {

  displayedColumns: string[] = ['expand', 'number', 'name', 'attended', 'noAlinea'];
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

  @Output() onChange = new EventEmitter<{ player: SheetPlayer, value: number, field: keyof SheetPlayer }>();

  ngAfterViewInit() {
    if (this.sort)
      this.dataSource.sort = this.sort;
  }

  canDecrement(player: SheetPlayer, field: keyof SheetPlayer): boolean {
    return player[field] > 0;
  }

  increment(player: SheetPlayer, field: keyof SheetPlayer) {
    player[field]++;
    this.onChange.emit({ player, value: 1, field });
  }

  decrement(player: SheetPlayer, field: keyof SheetPlayer) {
    if (this.canDecrement(player, field)) {
      player[field]--;
      this.onChange.emit({ player, value: -1, field });
    }
}
}