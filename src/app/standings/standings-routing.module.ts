import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RankingComponent } from './ranking/ranking.component';

const routes: Routes = [
  {
    path: '', component: RankingComponent,
    data: { title: 'Posiciones' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StandingsRoutingModule { }
