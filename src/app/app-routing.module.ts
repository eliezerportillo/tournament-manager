import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportExcelComponent } from './import-excel/import-excel.component';
import { ShellComponent } from './shell/shell.component';
import { TournamentComponent } from './routed/tournament/tournament.component';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        component: TournamentComponent
      },
      {
        path: 'import',
        component: ImportExcelComponent
      },
      
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
