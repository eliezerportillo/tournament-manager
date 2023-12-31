import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '@app-environments/environment';
import { AnalyticsModule } from '@angular/fire/analytics';



@NgModule({
  declarations: [],
  imports: [    
    AngularFireModule.initializeApp(environment.firebaseConfig)
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
