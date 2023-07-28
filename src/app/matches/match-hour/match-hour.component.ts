import { Component, Input, OnInit } from '@angular/core';
import { Match } from 'src/app/models/match';

@Component({
  selector: 'app-match-hour',
  templateUrl: './match-hour.component.html',
  styleUrls: ['./match-hour.component.scss']
})
export class MatchHourComponent implements OnInit {


  @Input()
  match?: Match;
  unfinished?: boolean;


  ngOnInit(): void {
    if (this.match) {
      const today = new Date();
      today.setHours(today.getHours() + 1);
      this.unfinished = today < this.match?.dateTime;
    }
  }


}
