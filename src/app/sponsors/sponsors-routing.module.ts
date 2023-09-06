import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SponsorsViewComponent } from './sponsors-view/sponsors-view.component';

const routes: Routes = [
  {
    path: '',
    component: SponsorsViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SponsorsRoutingModule { }
