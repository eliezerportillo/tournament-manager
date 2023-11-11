import { Component, Inject, OnInit, inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { IBanner } from '@app-core/models/banner';
import { IModalComponent } from '@app-core/models/editor-component';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements IModalComponent {


  bottomSheetRef: MatBottomSheetRef<BannerComponent> = inject(MatBottomSheetRef<BannerComponent>);

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: { banners: IBanner[] }) {
  }

  close() {
    this.bottomSheetRef.dismiss();
  }

  get activeBanner() {
    return this.data.banners[0];
  }

  get redirectUrl() {
    return `https://wa.me/${this.activeBanner.phoneNumber}?text=${this.activeBanner.autoMessage}`
  }
}
