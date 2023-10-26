import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExportRoutingModule } from './export-routing.module';
import { ExportExcelComponent } from './export-excel/export-excel.component';


@NgModule({
  declarations: [
    ExportExcelComponent
  ],
  imports: [
    CommonModule,
    ExportRoutingModule
  ]
})
export class ExportModule { }
