import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IMenu } from '@app-core/models/menu';
import { AccountService } from '@app-core/services/account.service';

@Component({
  selector: 'app-admin-shell',
  templateUrl: './admin-shell.component.html',
  styleUrls: ['./admin-shell.component.scss']
})
export class AdminShellComponent {
  accountService: AccountService = inject(AccountService);
  route: ActivatedRoute = inject(ActivatedRoute);  
  menus: IMenu[];
  

  constructor() {
    
    this.menus = [
      { text: 'EQUIPOS', path: '#', disabled: true },    
      { text: 'PARTIDOS', path:  `scores`, disabled: false },
      { text: 'JUGADORES', path:  `players`, disabled: false },
      { text: 'PATROCINADORES', path:  `sponsors`, disabled: false },
    ];
  }
}
