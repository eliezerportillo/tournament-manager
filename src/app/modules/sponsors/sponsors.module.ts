import { NgModule } from '@angular/core';
import { SponsorsRoutingModule } from './sponsors-routing.module';
import { SharedModule } from '@app-shared/shared.module';
import { MaterialModule } from '@app-material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SponsorCreateComponent } from './sponsor-create/sponsor-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SponsorListComponent } from './sponsors-list/sponsor-list.component';
import { SponsorsViewComponent } from './sponsors-view/sponsors-view.component';
import { SponsorItemComponent } from './sponsor-item/sponsor-item.component';



@NgModule({
  declarations: [
    SponsorsViewComponent,
    SponsorCreateComponent,
    SponsorListComponent,
    SponsorItemComponent
  ],
  imports: [
    SponsorsRoutingModule,
    SharedModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SponsorsModule { }
