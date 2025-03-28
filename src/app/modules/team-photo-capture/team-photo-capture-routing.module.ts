import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamPhotoCaptureViewComponent } from './team-photo-capture-view/team-photo-capture-view.component';

const routes: Routes = [
  {
    path: '',
    component: TeamPhotoCaptureViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamPhotoCaptureRoutingModule {}
