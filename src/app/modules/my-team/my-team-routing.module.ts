import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '@app-core/guards/auth.guard';
import { captainGuard } from '@app-core/guards/captain.guard';
import { MyTeamManagementComponent } from './my-team-management/my-team-management.component';

const routes: Routes = [
  {
    path: '',
    component: MyTeamManagementComponent,
    canActivate: [authGuard, captainGuard],
    data: { title: 'Gestión de Mi Equipo' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyTeamRoutingModule {}
