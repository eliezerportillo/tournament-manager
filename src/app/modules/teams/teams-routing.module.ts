import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingPlayersListComponent } from './pending-players-list/pending-players-list.component';

const routes: Routes = [
  {
    path: '',
    component: PendingPlayersListComponent,
    data: { title: 'Jugadores Pendientes de Aprobación' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamsRoutingModule {}
