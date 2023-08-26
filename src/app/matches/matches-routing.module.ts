import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from 'src/app/guards/auth.guard';
import { LineupComponent } from './lineups/lineup/lineup.component';
import { UploadLineupComponent } from './lineups/upload-lineup/upload-lineup.component';
import { MatchesViewComponent } from './matches-view/matches-view.component';


const routes: Routes = [
  { path: '', component: MatchesViewComponent },
  {
    path: 'view',
    component: LineupComponent
  },
  {
    path: 'lineup',
    component: UploadLineupComponent,
    canActivate: [authGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatchesRoutingModule { }
