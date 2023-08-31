import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor() { }

  getComponyName(): string {
    return 'AFC | Asociación de Futbol Cristiana';
  }

  getTournamentName(): string {
    return '1er Torneo de Fut7 Cristiano';
  }
}
