import localeEsMx from '@angular/common/locales/es-MX';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { FlexLayoutModule } from '@angular/flex-layout';





import { LOCALE_ID, NgModule } from '@angular/core';








import { registerLocaleData } from '@angular/common';
import { ShellComponent } from './shell/shell.component';


import { FirebaseModule } from './firebase/firebase.module';
import { MaterialModule } from './material/material.module';
import { SharedModule } from './shared/shared.module';
import { MatchesModule } from './matches/matches.module';





@NgModule({
  declarations: [
    AppComponent,
    ShellComponent,        
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
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es-MX' }],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor() {
    registerLocaleData(localeEsMx, 'es-MX');
  }
}
