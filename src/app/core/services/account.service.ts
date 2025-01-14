import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  accountSettings: AccountSettings = { companyName: '', tournamentName: '', zoneName: '' };
  settings: AccountSettings[] = [];
  constructor(private firestore: AngularFirestore) {
    this.getTournamentSettings();
  }


  get zoneName(): string {
    return this.settings[0]?.zoneName ?? '';
  }

  get companyName(): string {
    return this.settings[0]?.companyName ?? 'Asociación de Futbol Cristiana';
  }

  get tournamentName(): string {
    return this.settings[0]?.tournamentName ?? 'Torneo de Futbol Cristiano';
  }

  async getTournamentSettings(): Promise<void> {
    const querySnapshot = await firstValueFrom(this.firestore.collection('settings').get());
    querySnapshot.forEach((doc) => {
      this.settings.push(doc.data() as AccountSettings);
    });
    if (this.settings.length > 0) {
      this.accountSettings = this.settings[0];
    }
  }
}

interface AccountSettings {
  tournamentName: string;
  companyName: string;
  zoneName: string;
}
