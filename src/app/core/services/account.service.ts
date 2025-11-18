import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { firstValueFrom, Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  accountSettings: AccountSettings = {
    companyName: '',
    tournamentName: '',
    zoneName: '',
    edition: '',
    season: '',
  };
  settings: AccountSettings[] = [];

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) {
    this.getTournamentSettings();
  }

  get currentUser$(): Observable<firebase.User | null> {
    return this.auth.authState;
  }

  async getCurrentUser(): Promise<firebase.User | null> {
    return this.auth.currentUser;
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

  get edition(): string {
    return this.settings[0]?.edition ?? `Edición ${new Date().getFullYear()}`;
  }

  get season(): string {
    return this.settings[0]?.season ?? `Temporada ${new Date().getFullYear()}`;
  }

  async getTournamentSettings(): Promise<void> {
    const querySnapshot = await firstValueFrom(
      this.firestore.collection('settings').get()
    );
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
  edition: string;
  season: string;
}
