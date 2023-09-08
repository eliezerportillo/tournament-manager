import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TournamentComponent } from './tournament/tournament.component';

const routes: Routes = [
  {
    path: '',
    component: TournamentComponent,
    children: [      
      {
        path: 'matches',
        loadChildren: () => import('@app-modules/matches/matches.module').then(m => m.MatchesModule)
      },
      {
        path: 'ranking',
        loadChildren: () => import('@app-modules/standings/standings.module').then(m => m.StandingsModule)
      },
      {
        path: 'stats',
        loadChildren: () => import('@app-modules/statistics/statistics.module').then(m => m.StatisticsModule)
      },
      {
        path: 'bracket',
        loadChildren: () => import('../../bracket/bracket.module').then(m => m.BracketModule)
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentsRoutingModule { }
