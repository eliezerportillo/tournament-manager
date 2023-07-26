import { Component, Input } from '@angular/core';
import { Match } from 'src/app/models/match';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent {

  @Input()
  match?: Match;

  noPlay(match: Match): boolean { 
    return ![match.local.toLocaleLowerCase(), match.visita.toLocaleLowerCase()].includes('descansa');
  }
}
