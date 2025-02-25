import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatchSheetViewComponent } from './match-sheet-view/match-sheet-view.component';
import { SheetComponent } from './sheet/sheet.component';

const routes: Routes = [
  {
    path: '',
    component: MatchSheetViewComponent
  },
  {
    path: 'view',
    component: SheetComponent,
    data: {
      title: 'Cédula deportiva'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatchSheetsRoutingModule { }
