import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';

const routes: Routes = [
  { path: '', redirectTo: '/matches', pathMatch: 'full' },
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@app-modules/tournaments/tournaments.module').then(
            (m) => m.TournamentsModule
          ),
      },
      {
        path: 'import',
        loadChildren: () =>
          import('@app-modules/import/import.module').then(
            (m) => m.ImportModule
          ),
      },
    ],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('@app-modules/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('@app-modules/admin/admin.module').then((m) => m.AdminModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
