import { Component, Input } from '@angular/core';
import { Team } from '@app-core/models/team';

@Component({
  selector: 'app-team-image',
  templateUrl: './team-image.component.html',
  styleUrls: ['./team-image.component.scss']
})
export class TeamImageComponent {


  @Input()
  size?: string = 'small';

  @Input()
  src?: string;


  @Input()
  set team(value: string) {
    this.src = Team.createImageUrl(value);
  }

}
