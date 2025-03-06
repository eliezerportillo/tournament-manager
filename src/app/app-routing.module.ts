import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { EmptyShellComponent } from './empty-shell/empty-shell.component';

const routes: Routes = [
  {
    path: ':zone',
    component: EmptyShellComponent,
    children: [
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
          {
            path: 'export',
            loadChildren: () =>
              import('@app-modules/export/export.module').then(
                (m) => m.ExportModule
              ),
          },
          {
            path: 'reset',
            loadChildren: () =>
              import('@app-modules/reset/reset.module').then(
                (m) => m.ResetModule
              ),
          },
        ],
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('@app-modules/admin/admin.module').then((m) => m.AdminModule),
      },
      {
        path: 'sheets',
        loadChildren: () =>
          import('@app-modules/match-sheets/match-sheets.module').then(
            (m) => m.MatchSheetsModule
          ),
      },
      {
        path: 'login',
        loadChildren: () =>
          import('@app-modules/login/login.module').then((m) => m.LoginModule),
      },
      {
        path: 'players',
        loadChildren: () =>
          import('@app-modules/public-players/public-players.module').then(
            (m) => m.PublicPlayersModule
          ),
      },
      {
        path: 'photo',
        loadChildren: () =>
          import(
            '@app-modules/team-photo-capture/team-photo-capture.module'
          ).then((m) => m.TeamPhotoCaptureModule),
      },
      {
        path: 'widget',
        loadChildren: () =>
          import('@app-modules/widgets/widgets.module').then(
            (m) => m.WidgetsModule
          ),
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('@app-modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
