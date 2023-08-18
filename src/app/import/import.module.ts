import { NgModule } from '@angular/core';

import { ImportRoutingModule } from './import-routing.module';
import { ImportExcelComponent } from './import-excel/import-excel.component';
import { FirebaseModule } from '../firebase/firebase.module';

@NgModule({
  declarations: [
    ImportExcelComponent,
  ],
  imports: [    
    ImportRoutingModule,
    FirebaseModule
  ]
})
export class ImportModule { }
