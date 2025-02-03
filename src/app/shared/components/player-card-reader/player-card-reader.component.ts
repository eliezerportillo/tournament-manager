import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-player-card-reader',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule],
  templateUrl: './player-card-reader.component.html',
  styleUrls: ['./player-card-reader.component.scss'],

})
export class PlayerCardReaderComponent {
  @Output() scanSuccess = new EventEmitter<string>();

  handleQrCodeResult(result: string): void {
    if (result) {
      this.scanSuccess.emit(result);
    }
  }
}
