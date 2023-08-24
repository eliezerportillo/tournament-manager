import { Component, Input, OnInit } from '@angular/core';
import { IMatch, Match } from 'src/app/models/match';

@Component({
  selector: 'app-match-hour',
  templateUrl: './match-hour.component.html',
  styleUrls: ['./match-hour.component.scss']
})
export class MatchHourComponent implements OnInit {


  @Input()
  match?: IMatch;
  unfinished?: boolean;


  ngOnInit(): void {
    if (this.match) {      
      this.unfinished = !Match.isFinished(this.match.dateTime)
    }
  }


}
