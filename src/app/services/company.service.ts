import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor() { }

  getCompanyName() {
    return environment.company.name;
  }
}
