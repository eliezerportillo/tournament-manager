import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { INamedObject } from '@app-core/models/named.object';

@Component({
  selector: 'app-batch-creator',
  templateUrl: './batch-creator.component.html',
  styleUrls: ['./batch-creator.component.scss']
})
export class BatchCreatorComponent {


  @Input()
  control: FormControl | null;

  constructor() {
    this.control = new FormControl<string>('', Validators.required);
  }


  createObjects<T extends INamedObject>(): T[] {
    const lines: string[] = this.control?.value?.split('\n');
    return lines.map(line => ({ name: line.trim() } as T));
  }
}
