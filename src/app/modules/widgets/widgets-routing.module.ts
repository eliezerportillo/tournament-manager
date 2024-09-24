import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SponsorsWidgetComponent } from './sponsors-widget/sponsors-widget.component';

const routes: Routes = [
  // route to sponsor widget
  {
    path: 'sponsors',
    component: SponsorsWidgetComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WidgetsRoutingModule { }
