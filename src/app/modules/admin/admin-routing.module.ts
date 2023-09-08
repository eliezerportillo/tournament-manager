import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminShellComponent } from './admin-shell/admin-shell.component';
import { ScoresViewComponent } from './scores-view/scores-view.component';
import { authGuard } from '@app-core/guards/auth.guard';

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
        path: 'sponsors',
        loadChildren: () => import('@app-modules/sponsors/sponsors.module').then(m => m.SponsorsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
