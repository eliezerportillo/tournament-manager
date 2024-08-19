import { Component, inject } from '@angular/core';
import { AccountService } from '@app-core/services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  accountService = inject(AccountService);
  titulo = this.accountService.getTournamentName();
}
