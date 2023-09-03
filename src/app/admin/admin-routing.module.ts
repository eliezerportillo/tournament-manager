import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminShellComponent } from './admin-shell/admin-shell.component';
import { ScoresViewComponent } from './scores-view/scores-view.component';
import { authGuard } from '../guards/auth.guard';
import { SponsorsViewComponent } from './sponsors/sponsors-view/sponsors-view.component';

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
        component: SponsorsViewComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
