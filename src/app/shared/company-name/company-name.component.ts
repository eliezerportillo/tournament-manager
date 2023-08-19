import { Component, OnInit, inject } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-company-name',
  templateUrl: './company-name.component.html',
  styleUrls: ['./company-name.component.scss']
})
export class CompanyNameComponent implements OnInit {

  companyService: CompanyService = inject(CompanyService);
  name: string = '';

  ngOnInit(): void {
    this.name = this.companyService.getCompanyName();
  }
}
