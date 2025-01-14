import localeEsMx from '@angular/common/locales/es-MX';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { ShellComponent } from './shell/shell.component';
import { FirebaseModule } from './firebase/firebase.module';
import { MaterialModule } from '@app-material/material.module';
import { SharedModule } from '@app-shared/shared.module';
import { MatchesModule } from '@app-modules/matches/matches.module';
import { HttpClientModule } from '@angular/common/http';
import { CustomErrorHandler } from '@app-core/handlers/error-handler.service';
import { EmptyShellComponent } from './empty-shell/empty-shell.component';


@NgModule({
  declarations: [
    AppComponent,
    ShellComponent,
    EmptyShellComponent
  ],
  imports: [
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FirebaseModule,
    MaterialModule,
    FlexLayoutModule,
    MatchesModule,
    HttpClientModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-MX' },
    { provide: ErrorHandler, useClass: CustomErrorHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor() {

    registerLocaleData(localeEsMx, 'es-MX');
  }
}
