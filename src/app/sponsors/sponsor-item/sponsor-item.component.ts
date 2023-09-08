import { Component, Input, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ISponsor } from 'src/app/models/sponsor';
import { SponsorCreateComponent } from '../sponsor-create/sponsor-create.component';
import { SponsorService } from 'src/app/services/sponsor.service';
import { ModalService } from 'src/app/services/modal.service';



@Component({
  selector: 'app-sponsor-item',
  templateUrl: './sponsor-item.component.html',
  styleUrls: ['./sponsor-item.component.scss']
})
export class SponsorItemComponent {
  bottomSheet: MatBottomSheet = inject(MatBottomSheet);
  sponsorService: SponsorService = inject(SponsorService);
  modal = inject(ModalService);
  @Input()
  sponsor?: ISponsor;

  open() {
    this.bottomSheet.open(SponsorCreateComponent, { disableClose: true, data: { sponsor: this.sponsor } });
  }

  delete() {

    this.openConfirmationDialog().subscribe(result => {

      if (result && this.sponsor) {
        this.sponsorService.delete(this.sponsor);
      }
    });
  }

  openConfirmationDialog() {
    return this.modal.confirm('¿Estás seguro de que deseas eliminar?');
  }
}
