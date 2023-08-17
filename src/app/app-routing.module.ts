import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportExcelComponent } from './import-excel/import-excel.component';
import { ShellComponent } from './shell/shell.component';
import { TournamentComponent } from './routed/tournament/tournament.component';
import { LineupComponent } from './routed/matches/lineup/lineup.component';
import { UploadLineupComponent } from './routed/matches/upload-lineup/upload-lineup.component';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { MatchListComponent } from './matches/match-list/match-list.component';
import { RankingComponent } from './standings/ranking/ranking.component';
import { StatsComponent } from './players/stats/stats.component';


const routes: Routes = [
  { path: '', redirectTo: '/matches', pathMatch: 'full' },

  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        component: TournamentComponent,        
        children: [
          {  path: 'matches', component: MatchListComponent },
          {  path: 'ranking', component: RankingComponent },
          {  path: 'stats', component: StatsComponent },      
        ]
      },
      {
        path: 'import',
        component: ImportExcelComponent
      },
      {
        path: 'lineup',
        component: LineupComponent
      },
      {
        path: 'upload-lineup',
        component: UploadLineupComponent,
        canActivate: [authGuard]

      },

    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
