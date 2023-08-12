import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportExcelComponent } from './import-excel/import-excel.component';
import { ShellComponent } from './shell/shell.component';
import { TournamentComponent } from './routed/tournament/tournament.component';
import { LineupComponent } from './routed/matches/lineup/lineup.component';
import { UploadLineupComponent } from './routed/matches/upload-lineup/upload-lineup.component';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        component: TournamentComponent
      },
      {
        path: 'import',
        component: ImportExcelComponent
      },
      {
        path: 'lineup',
        component: LineupComponent
      },
      {
        path: 'upload-lineup',
        component: UploadLineupComponent,
        canActivate: [authGuard]

      },

    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
