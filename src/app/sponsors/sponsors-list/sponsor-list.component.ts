import { Component, Input } from '@angular/core';
import { ISponsor } from 'src/app/models/sponsor';

@Component({
  selector: 'app-sponsor-list',
  templateUrl: './sponsor-list.component.html',
  styleUrls: ['./sponsor-list.component.scss']
})
export class SponsorListComponent {

  @Input()
  sponsors?: ISponsor[];
}
