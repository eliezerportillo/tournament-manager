import { NgModule } from '@angular/core';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '@app-shared/shared.module';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    LoginRoutingModule,
    MatButtonModule,
    SharedModule
  ]
})
export class LoginModule { }
