import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BracketViewComponent } from './bracket-view/bracket-view.component';

const routes: Routes = [
  {
    path: '', component: BracketViewComponent,
    data: { title: 'Fase final' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BracketRoutingModule { }
