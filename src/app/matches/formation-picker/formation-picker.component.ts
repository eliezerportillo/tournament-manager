import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Formation } from 'src/app/models/formation';
import { FutSystemBuilder } from 'src/app/models/futSystemBuilder';
import { Markable } from 'src/app/models/lineup';


@Component({
  selector: 'app-formation-picker',
  templateUrl: './formation-picker.component.html',
  styleUrls: ['./formation-picker.component.scss']
})
export class FormationPickerComponent {
  futSystem?: Markable[][];

  @Output()
  onClick = new EventEmitter<Markable>();



  builder?: FutSystemBuilder;


  @Input()
  set formation(value: Formation) {
    this.builder = new FutSystemBuilder(value);
    this.builder.buildSystem();
    this.futSystem = this.builder.getSystem();
  }

  @Input() teamName = '';
  @Input() teamImage = '';

  get team(): { name: string, image: string } {
    return { name: this.teamName, image: this.teamImage };
  }

  mark(player: Markable) {    
    this.onClick.emit(player);
  }
}
