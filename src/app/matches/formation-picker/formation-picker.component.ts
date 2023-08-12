import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Formation } from 'src/app/models/formation';
import { FutSystemBuilder } from 'src/app/models/futSystemBuilder';
import { LineUp, Markable } from 'src/app/models/lineup';
import { Player } from 'src/app/models/player';

@Component({
  selector: 'app-formation-picker',
  templateUrl: './formation-picker.component.html',
  styleUrls: ['./formation-picker.component.scss']
})
export class FormationPickerComponent {
  futSystem?: Markable[][];

  @Output()
  onClick: EventEmitter<Markable> = new EventEmitter<Markable>();



  builder?: FutSystemBuilder;


  @Input()
  set formation(value: Formation) {
    this.builder = new FutSystemBuilder(value);
    this.builder.buildSystem();
    this.futSystem = this.builder.getSystem();
  }

  @Input() teamName: string = '';
  @Input() teamImage: string = '';

  get team(): { name: string, image: string } {
    return { name: this.teamName, image: this.teamImage };
  }

  mark(player: Markable) {    
    this.onClick.emit(player);
  }
}
