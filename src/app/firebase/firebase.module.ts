import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '@app-environments/environment';
import { AnalyticsModule } from '@angular/fire/analytics';

export function initializeApp(): ModuleWithProviders<AngularFireModule> {
  let config = null;
  const browserRrl = window.location.href.split('/')[3].split('.')[0];
  switch (browserRrl) {
    case 'colima':
      config = environment.firebaseConfigColima;
      break;
    case 'tijuana':
      config = environment.firebaseConfigTijuana;
      break;
    default:
      config = environment.firebaseConfig;
  }
  return AngularFireModule.initializeApp(config, browserRrl);
}

@NgModule({
  declarations: [],
  imports: [
    initializeApp(),
  ],
  exports: [
    AngularFireModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AnalyticsModule
  ]
})
export class FirebaseModule { }
