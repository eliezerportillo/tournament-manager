import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { MyTeamRoutingModule } from './my-team-routing.module';
import { MyTeamManagementComponent } from './my-team-management/my-team-management.component';
import { MaterialModule } from '@app-material/material.module';
import { SharedModule } from '@app-shared/shared.module';

@NgModule({
  declarations: [MyTeamManagementComponent],
  imports: [CommonModule, MyTeamRoutingModule, MaterialModule, SharedModule],
})
export class MyTeamModule {}
