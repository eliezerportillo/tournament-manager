import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  imports: [CommonModule, FlexLayoutModule],
  standalone: true
})
export class CarouselComponent {
  @Input({ required: true })
  images: string[] = [];

  @Input()
  for: 'logos' | 'images' = 'images';

  currentIndex: number = 0;
  intervalId: any;

  ngOnInit(): void {
    if (this.images.length > 1) {
      this.startAutoSlide();
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change image every 5 seconds
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
  }

  get shouldShowDots(): boolean {
    return this.images.length > 1;
  }
}
