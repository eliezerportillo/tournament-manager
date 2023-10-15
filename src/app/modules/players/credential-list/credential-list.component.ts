import { Component, ElementRef, Inject, inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { IBadge } from '@app-core/models/bagde';
import { IModalComponent } from '@app-core/models/editor-component';
import { IPlayer } from '@app-core/models/player';
import { BadgeService } from '@app-core/services/badge.service';
import { Observable } from 'rxjs';
import { BadgeItemComponent } from '../badge-item/badge-item.component';

import html2canvas from 'html2canvas';
import * as JSZip from 'jszip';

@Component({
  selector: 'app-credential-list',
  templateUrl: './credential-list.component.html',
  styleUrls: ['./credential-list.component.scss']
})
export class CredentialListComponent implements IModalComponent, OnInit {

  bottomSheetRef = inject(MatBottomSheetRef<CredentialListComponent>);
  badgeService = inject(BadgeService);
  badges$?: Observable<IBadge[]>;

  @ViewChildren(BadgeItemComponent) badgeItems?: QueryList<BadgeItemComponent>;


  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: CredentialListData) {
  }

  ngOnInit(): void {
    this.badges$ = this.badgeService.get(ref => ref.where('teamName', '==', this.data.teamName));

  }


  close(): void {
    this.bottomSheetRef.dismiss();
  }

  getPlayer(badge: IBadge) {
    return this.data.players.find(x => x.name == badge.playerName);
  }

  loading = false;
  async handleDownload() {
    this.loading = true;
    if (!this.badgeItems) return;

    const zip = new JSZip();

    for (const credential of this.badgeItems) {
      const canvas = await html2canvas(credential.getNativeElement());
      const base64Image = canvas.toDataURL('image/png');
      zip.file(`${credential.badge?.teamName}_${credential.badge?.playerName}.png`, base64Image.split('base64,')[1], { base64: true });
    }

    zip.generateAsync({ type: 'blob' }).then(content => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'badges.zip';
      link.click();
    });

    this.loading = false;
  }

}

interface CredentialListData {
  players: IPlayer[];
  teamName: string;
}
