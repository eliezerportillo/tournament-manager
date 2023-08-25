import { Component, OnInit, inject } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-company-name',
  templateUrl: './company-name.component.html',
  styleUrls: ['./company-name.component.scss']
})
export class CompanyNameComponent implements OnInit {

  accountService: AccountService = inject(AccountService);
  name: string = '';

  ngOnInit(): void {
    this.name = this.accountService.getComponyName();
  }
}
