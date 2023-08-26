import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { TournamentComponent } from './tournaments/tournament/tournament.component';

import { LoginComponent } from './login/login.component';


const routes: Routes = [
  { path: '', redirectTo: '/matches', pathMatch: 'full' },
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./tournaments/tournaments.module').then(m => m.TournamentsModule)
      },
      {
        path: 'import',
        loadChildren: () => import('./import/import.module').then(m => m.ImportModule)
      } 
    ]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },   
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
