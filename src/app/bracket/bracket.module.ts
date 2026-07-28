import { NgModule } from '@angular/core';
import { BracketRoutingModule } from './bracket-routing.module';
import { BracketViewComponent } from './bracket-view/bracket-view.component';
import { SharedModule } from '@app-shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app-material/material.module';

@NgModule({
  declarations: [BracketViewComponent],
  imports: [
    SharedModule,
    MaterialModule,
    FlexLayoutModule,
    BracketRoutingModule,
  ],
})
export class BracketModule {}
