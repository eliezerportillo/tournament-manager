import { Component, Input } from '@angular/core';
import { Group } from 'src/app/models/group';
import { IMatch } from 'src/app/models/match';

@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.scss']
})
export class MatchListComponent {

  @Input()
  matches?: Group<IMatch>[];
}
