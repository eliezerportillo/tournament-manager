import { Component, OnInit, inject } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  companyService: CompanyService = inject(CompanyService);

  titulo: string = '';

  ngOnInit(): void {
    this.titulo = this.companyService.getCompanyName();
  }
}
