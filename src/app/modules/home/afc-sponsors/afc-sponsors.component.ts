import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SponsorService } from '@app-core/services/sponsor.service';
import { Observable, tap } from 'rxjs';
import { ISponsor } from '@app-core/models/sponsor';
import { MatButtonModule } from '@angular/material/button';
import { CarouselComponent } from '../carousel/carousel.component';

@Component({
  selector: 'app-afc-sponsors',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, CarouselComponent],
  templateUrl: './afc-sponsors.component.html',
  styleUrls: ['./afc-sponsors.component.scss']
})
export class AfcSponsorsComponent {
  sponsorService = inject(SponsorService);
  sponsors$: Observable<ISponsor[]>;
  logos: string[] = [];

  constructor() {
    this.sponsors$ = this.sponsorService.get().pipe(
      tap(sponsors => {
        this.logos = sponsors.map(sponsor => sponsor.logoUrl);
      }
      ));
  }
}
