import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/matches', pathMatch: 'full' },
  // {
  //   path: 'home',
  //   component: HomeComponent
  // },
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./tournaments/tournaments.module').then(m => m.TournamentsModule)
      }
    ]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'import',
    loadChildren: () => import('./import/import.module').then(m => m.ImportModule)
  },
  { path: '**', redirectTo: '/matches' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
