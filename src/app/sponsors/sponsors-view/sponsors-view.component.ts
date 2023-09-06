import { Component, OnInit, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ISponsor } from 'src/app/models/sponsor';
import { SponsorService } from 'src/app/services/sponsor.service';
import { SponsorCreateComponent } from '../sponsor-create/sponsor-create.component';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-sponsors-view',
  templateUrl: './sponsors-view.component.html',
  styleUrls: ['./sponsors-view.component.scss']
})
export class SponsorsViewComponent implements OnInit {

  bottomSheet: MatBottomSheet = inject(MatBottomSheet);

  sponsorService: SponsorService = inject(SponsorService);
  sponsors: ISponsor[] = [];
  sponsors$?: Observable<ISponsor[]>;

  hasSponsors = false;

  ngOnInit(): void {
    this.sponsors$ = this.sponsorService.get().pipe(
      tap(sponsors => {
        this.hasSponsors = sponsors.length > 0;
      })
    );
  }

  newSponsor() {
    this.bottomSheet.open(SponsorCreateComponent, { disableClose: true });
  }
}
