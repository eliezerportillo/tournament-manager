import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IMatch, Match } from '@app-core/models/match';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent {

  @Input()
  match?: IMatch;

  @Output()
  selected: EventEmitter<IMatch> = new EventEmitter<IMatch>()

  select(event: IMatch) {
    this.selected.emit(event);
  }

  noPlay(match: IMatch): boolean {
    return Match.noPlay(match);
  }

  isFinished(match: IMatch): boolean {
    return Match.isFinished(match.dateTime);
  }
}
