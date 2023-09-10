import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayersViewComponent } from '@app-modules/players/players-view/players-view.component';
const routes: Routes = [
  {
    path: '',
    component: PlayersViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayersRoutingModule { }
