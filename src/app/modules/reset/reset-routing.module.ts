import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CleanTournamentComponent } from './clean-tournament/clean-tournament.component';

const routes: Routes = [
  {
    path: '',
    component: CleanTournamentComponent,
    data: { title: 'Limpiar datos del torneo' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResetRoutingModule { }
