import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExportExcelComponent } from './export-excel/export-excel.component';

const routes: Routes = [
  {
    path: '',
    component: ExportExcelComponent,
    data: { title: 'Exportar información del torneo' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExportRoutingModule { }
