import { Component, Input, inject } from '@angular/core';
import { IBadge } from '@app-core/models/bagde';
import { AccountService } from '@app-core/services/account.service';
import { environment } from '@app-environments/environment';

@Component({
  selector: 'app-badge-item',
  templateUrl: './badge-item.component.html',
  styleUrls: ['./badge-item.component.scss']
})
export class BadgeItemComponent {


  @Input()
  badge?: IBadge;

  accountService = inject(AccountService);
  tournamentName: string;
  componyName: string;
  
  constructor() {
    this.componyName = this.accountService.getComponyName();
    this.tournamentName = this.accountService.getTournamentName();
  }


}
