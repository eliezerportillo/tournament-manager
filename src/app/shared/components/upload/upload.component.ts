import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {

  @Input()
  mode: string;
  @Input()
  text: string;
  @Input()
  accept: string;

  
  @Output()
  file = new EventEmitter<string>();
  
  constructor() {
    this.mode = 'image';
    this.text = 'Añadir foto';
    this.accept = 'image/png';
  }


  fileSelected($event: any): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    let file: File = inputValue.files[0];
    let myReader: FileReader = new FileReader();
    // let fileType = inputValue.parentElement.id;
    myReader.onloadend = () => {
      const fileString = myReader.result as string;
      this.file.emit(fileString);
    };

    myReader.readAsDataURL(file);
  }



}