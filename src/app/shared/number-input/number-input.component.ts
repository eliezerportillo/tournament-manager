import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms'

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
})
export class NumberInputComponent {
  @Input() control?: FormControl;
  @Input() controlName?: string;

  increment() {
    this.control?.setValue(this.control.value + 1);
  }

  decrement() {
    this.control?.setValue(this.control.value - 1);
  }

  getErrorMessage() {
    if (this.control?.hasError('required')) {
      return 'Campo obligatorio';
    }
    
    if (this.control?.hasError('min')) {
      return `Valor no puede ser mejor que ${ this.control.getError('min').min }`;
    }

    if (this.control?.hasError('max')) {
      return `Valor no puede ser mejor que ${ this.control.getError('max').max }`;
    }

    return '';
  }
}
