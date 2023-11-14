import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExportRoutingModule } from './export-routing.module';
import { ExportExcelComponent } from './export-excel/export-excel.component';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MaterialModule } from '@app-material/material.module';


@NgModule({
  declarations: [
    ExportExcelComponent
  ],
  imports: [
    CommonModule,
    ExportRoutingModule,
    MaterialModule
  ]
})
export class ExportModule { }
