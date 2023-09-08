import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '@app-core/guards/auth.guard';
import { LineupComponent } from './lineups/lineup/lineup.component';
import { UploadLineupComponent } from './lineups/upload-lineup/upload-lineup.component';
import { MatchesViewComponent } from './matches-view/matches-view.component';


const routes: Routes = [
  {
    path: '', component: MatchesViewComponent,
    data: { title: 'Partidos' }
  },
  {
    path: 'view',
    component: LineupComponent,
    data: { title: 'Ver partido' }
  },
  {
    path: 'lineup',
    component: UploadLineupComponent,
    data: { title: 'Subir alineación' },
    canActivate: [authGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatchesRoutingModule { }
