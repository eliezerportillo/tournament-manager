import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerPhotoCaptureViewComponent } from './player-photo-capture-view/player-photo-capture-view.component';

const routes: Routes = [
  {
    path: '',
    component: PlayerPhotoCaptureViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicPlayersRoutingModule { }
