import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-afc-zones',
  standalone: true,
  imports: [CommonModule, MatCardModule, FlexLayoutModule, MatToolbarModule, MatButtonModule],
  templateUrl: './afc-zones.component.html',
  styleUrls: ['./afc-zones.component.scss']
})
export class AfcZonesComponent {

}
