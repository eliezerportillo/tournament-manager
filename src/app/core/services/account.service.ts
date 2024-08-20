import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  

  getComponyName(): string {
    return 'AFC | Asociación de Futbol Cristiana';
  }

  getTournamentName(): string {
    return '3er Torneo de Fut7 Cristiano';
  }
}
