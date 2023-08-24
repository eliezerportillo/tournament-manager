import { Component, Input } from '@angular/core';
import { IMatch } from 'src/app/models/match';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent {

  @Input()
  match?: IMatch;

  noPlay(match: IMatch): boolean { 
    return ![match.local.toLocaleLowerCase(), match.visita.toLocaleLowerCase()].includes('descansa');
  }
}
