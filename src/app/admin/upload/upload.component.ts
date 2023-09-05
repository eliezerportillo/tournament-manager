import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  @Input()
  mode: string;
  @Input()
  text: string;
  @Input()
  accept: string;

  
  @Output()
  file = new EventEmitter<any>();
  
  constructor() {
    this.mode = 'image';
    this.text = 'Añadir foto';
    this.accept = 'image/png';
  }


  fileSelected($event: any): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();
    var fileType = inputValue.parentElement.id;
    myReader.onloadend = (e) => {
      const fileString = myReader.result;
      this.file.emit(fileString);
    };

    myReader.readAsDataURL(file);
  }

  ngOnInit(): void {

  }

}