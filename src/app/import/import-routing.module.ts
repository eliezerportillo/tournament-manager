import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportExcelComponent } from './import-excel/import-excel.component';

const routes: Routes = [
  // { path: '', redirectTo: '/import', pathMatch: 'full' },
  {
    path: '',
    component: ImportExcelComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportRoutingModule { }
