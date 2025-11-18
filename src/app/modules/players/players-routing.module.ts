import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayersViewComponent } from '@app-modules/players/players-view/players-view.component';
import { captainGuard } from '@app-core/guards/captain.guard';

const routes: Routes = [
  {
    path: '',
    component: PlayersViewComponent,
    data: { title: 'Administrar Jugadores' },
  },
  {
    path: 'my-team',
    loadChildren: () =>
      import('@app-modules/my-team/my-team.module').then((m) => m.MyTeamModule),
    canActivate: [captainGuard],
    data: { title: 'Gestión de Mi Equipo' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayersRoutingModule {}
