import { Component, Input } from '@angular/core';
import { IMatch } from '@app-core/models/match';
import { IMatchSheet } from '@app-core/models/match-sheet';
import { SheetPlayer } from '@app-core/models/sheet-player';

@Component({
  selector: 'app-match-sheet-printable',
  templateUrl: './match-sheet-printable.component.html',
  styleUrls: ['./match-sheet-printable.component.scss'],
})
export class MatchSheetPrintableComponent {
  @Input() matchSheet?: IMatchSheet;
  @Input() match?: IMatch;
  @Input() local!: string;
  @Input() visita!: string;
  @Input() homePlayers!: SheetPlayer[];
  @Input() awayPlayers!: SheetPlayer[];
  currentDate = new Date();
}
