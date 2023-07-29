import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-team-image',
  templateUrl: './team-image.component.html',
  styleUrls: ['./team-image.component.scss']
})
export class TeamImageComponent {

  @Input()
  src?: string;

}
