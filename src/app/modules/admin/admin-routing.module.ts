import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminShellComponent } from './admin-shell/admin-shell.component';
import { ScoresViewComponent } from './scores-view/scores-view.component';
import { authGuard } from '@app-core/guards/auth.guard';
import { AdminOperationsViewComponent } from './admin-operations-view/admin-operations-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    component: AdminShellComponent,
    children: [
      {
        path: 'scores',
        component: ScoresViewComponent
      },
      {
        path: 'operations',
        component: AdminOperationsViewComponent
      },
      {
        path: 'sponsors',
        loadChildren: () => import('@app-modules/sponsors/sponsors.module').then(m => m.SponsorsModule)
      },
      {
        path: 'players',
        loadChildren: () => import('@app-modules/players/players.module').then(m => m.PlayersModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
