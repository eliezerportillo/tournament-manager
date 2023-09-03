import { Component, inject } from '@angular/core';
import { ISponsor } from 'src/app/models/sponsor';
import { SponsorService } from 'src/app/services/sponsor.service';

@Component({
  selector: 'app-sponsors-view',
  templateUrl: './sponsors-view.component.html',
  styleUrls: ['./sponsors-view.component.scss']
})
export class SponsorsViewComponent {
  sponsorService: SponsorService = inject(SponsorService);
  sponsors: ISponsor[] = [];

  get hasSponsors() {
    return this.sponsors.length > 0;
  }
}
