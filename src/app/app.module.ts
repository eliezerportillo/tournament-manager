import localeEsMx from '@angular/common/locales/es-MX';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ErrorHandler, LOCALE_ID, NgModule, importProvidersFrom } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { ShellComponent } from './shell/shell.component';
import { FirebaseModule } from './firebase/firebase.module';
import { MaterialModule } from '@app-material/material.module';
import { SharedModule } from '@app-shared/shared.module';
import { MatchesModule } from '@app-modules/matches/matches.module';
import { HttpClientModule } from '@angular/common/http';
import { CustomErrorHandler } from '@app-core/handlers/error-handler.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from '@app-environments/environment';
import { AngularFireModule } from '@angular/fire/compat';




@NgModule({
  declarations: [
    AppComponent,
    ShellComponent,
  ],
  imports: [
    
    // FirebaseModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),

    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    MatchesModule,
    HttpClientModule,
    
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-MX' },
    { provide: ErrorHandler, useClass: CustomErrorHandler },
    // ScreenTrackingService,
    // UserTrackingService
    importProvidersFrom([
      provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore()),
      provideStorage(() => getStorage()),
      provideAnalytics(() => getAnalytics()),
    ]),
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor() {

    registerLocaleData(localeEsMx, 'es-MX');
  }
}
