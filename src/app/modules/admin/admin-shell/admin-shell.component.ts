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
  zone: string;
  menus: IMenu[];
  

  constructor() {
    this.zone = this.route.snapshot.paramMap.get('zone') || '';
    this.menus = [
      { text: 'EQUIPOS', path: '#', disabled: true },    
      { text: 'PARTIDOS', path:  `/${this.zone}/scores`, disabled: false },
      { text: 'JUGADORES', path:  `/${this.zone}/players`, disabled: false },
      { text: 'PATROCINADORES', path:  `/${this.zone}/sponsors`, disabled: false },
    ];
  }
}
