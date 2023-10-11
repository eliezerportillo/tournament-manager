import { Component, Inject, inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { IBadge } from '@app-core/models/bagde';
import { IModalComponent } from '@app-core/models/editor-component';
import { IPlayer } from '@app-core/models/player';
import { BadgeService } from '@app-core/services/badge.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-credential-list',
  templateUrl: './credential-list.component.html',
  styleUrls: ['./credential-list.component.scss']
})
export class CredentialListComponent implements IModalComponent, OnInit {

  bottomSheetRef = inject(MatBottomSheetRef<CredentialListComponent>);
  badgeService = inject(BadgeService);
  badges$?: Observable<IBadge[]>;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: CredentialListData) {
  }

  ngOnInit(): void {
    this.badges$ = this.badgeService.get(ref => ref.where('teamName', '==', this.data.teamName));
  }


  close(): void {
    this.bottomSheetRef.dismiss();
  }
}

interface CredentialListData {
  players: IPlayer[];
  teamName: string;
}
