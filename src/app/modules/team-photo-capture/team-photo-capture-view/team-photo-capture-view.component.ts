import { Component, HostListener, ChangeDetectorRef } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-team-photo-capture-view',
  templateUrl: './team-photo-capture-view.component.html',
  styleUrls: ['./team-photo-capture-view.component.scss'],
})
export class TeamPhotoCaptureViewComponent {
  trigger: Subject<void> = new Subject<void>();
  public webcamImage?: WebcamImage;
  screenWidth: number;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateScreenWidth();
  }

  constructor(private cdr: ChangeDetectorRef) {
    this.screenWidth = window.innerWidth;
  }

  private updateScreenWidth() {
    this.screenWidth = window.innerWidth;
    this.cdr.detectChanges(); // Manually trigger change detection
  }

  // ngOnInit(): void {

  capture(): void {
    this.trigger.next();
  }

  captureAgain(): void {
    this.webcamImage = undefined;
  }

  submit(): void {
    if (this.webcamImage) {
      // Handle the submission of the captured image
      console.log('Image submitted:', this.webcamImage.imageAsDataUrl);
    } else {
      console.error('No image to submit');
    }
  }
}
