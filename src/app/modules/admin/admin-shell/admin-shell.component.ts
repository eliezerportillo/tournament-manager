import { Component, inject } from '@angular/core';
import { AccountService } from '@app-core/services/account.service';

@Component({
  selector: 'app-admin-shell',
  templateUrl: './admin-shell.component.html',
  styleUrls: ['./admin-shell.component.scss']
})
export class AdminShellComponent {
  accountService: AccountService = inject(AccountService);

  menus = [
    { text: 'EQUIPOS', path: '#', disabled: true },    
    { text: 'PARTIDOS', path: 'scores', disabled: false },
    { text: 'PATROCINADORES', path: 'sponsors', disabled: false },
  ];
}
