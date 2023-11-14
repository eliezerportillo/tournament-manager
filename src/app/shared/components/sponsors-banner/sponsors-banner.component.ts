import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild, inject, OnDestroy } from '@angular/core';
import { ISponsor } from '@app-core/models/sponsor';
import { SponsorService } from '@app-core/services/sponsor.service';
import { firstValueFrom, tap } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { EventEmitterService } from '@app-core/services/event-emitter.service';

@Component({
  selector: 'app-sponsors-banner',
  templateUrl: './sponsors-banner.component.html',
  styleUrls: ['./sponsors-banner.component.scss']
})
export class SponsorsBannerComponent implements OnInit, OnDestroy {

  currentPage = 0;
  itemsPerPage = 1;
  interval?: NodeJS.Timer; // To hold the interval reference
  hasSponsors = false;
  @Input()
  sponsors: ISponsor[] = [];

  private breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  private eventEmitterService: EventEmitterService = inject(EventEmitterService);
  sponsorService: SponsorService = inject(SponsorService);
  private renderer: Renderer2 = inject(Renderer2);
  @ViewChild('logoCarousel', { static: true }) logoCarouselRef!: ElementRef;
  intervalProgress: any;
  progress = 0;
  paused = false;


  ngOnInit(): void {
    this.checkBreakpoint();
    this.load();
    this.startTimer();
  }

  get canShowProgressBar() {
    return this.sponsors.length > this.itemsPerPage && false;
  }

  checkBreakpoint() {
    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .subscribe(result => {
        if (result.matches) {
          if (result.breakpoints[Breakpoints.XSmall]) {
            console.log('Breakpoint XSmall');
            this.itemsPerPage = 1;
          } else
            if (result.breakpoints[Breakpoints.Small]) {
              console.log('Breakpoint Small');
              this.itemsPerPage = 3;
            } else
              if (result.breakpoints[Breakpoints.Medium]) {
                console.log('Breakpoint Medium');
                this.itemsPerPage = 4;
              } else
                if (result.breakpoints[Breakpoints.Large]) {
                  console.log('Breakpoint Large');
                  this.itemsPerPage = 5;
                } else
                  if (result.breakpoints[Breakpoints.XLarge]) {
                    console.log('Breakpoint XLarge');
                    this.itemsPerPage = 6;
                  }
        }
      });
  }


  ngOnDestroy(): void {
    this.stopAutoCarousel();
  }

  stopAutoCarousel() {
    clearInterval(this.intervalProgress);

  }

  startTimer() {
    this.intervalProgress = setInterval(() => this.checkChange(), 80);
  }

  checkChange() {

    if (this.progress < 100) {
      this.progress += 1;
    } else {

      this.nextLogo();
      this.progress = 0;

    }


  }

  startAutoCarousel() {
    this.interval = setInterval(() => {
      this.nextLogo();
    }, 8000);
  }

  async load() {
    const sp = this.sponsorService.get().pipe(
      tap(sponsors => this.hasSponsors = sponsors.length > 0)
    );
    this.sponsors = await firstValueFrom(sp);
    this.sponsors = this.sponsors.sort((a, b) => a.priority - b.priority);

  }

  private checkAndfillLastPage() {
    if (this.sponsors.length % this.itemsPerPage === 1) {
      const lastItems = this.sponsors.slice(-1 * (this.itemsPerPage - 1));
      this.sponsors.push(...lastItems);
    }
  }

  nextLogo() {
    this.currentPage = (this.currentPage + 1) % Math.ceil(this.sponsors.length / this.itemsPerPage);
  }

  prevLogo() {
    this.currentPage = (this.currentPage - 1 + Math.ceil(this.sponsors.length / this.itemsPerPage)) % Math.ceil(this.sponsors.length / this.itemsPerPage);
  }

  getVisibleLogos() {
    const startIdx = this.currentPage * this.itemsPerPage;
    const endIdx = startIdx + this.itemsPerPage;
    return this.sponsors.slice(startIdx, endIdx);
  }

  sponsorClicked(sponsor: ISponsor) {
    this.eventEmitterService.emitSponsorClickedEvent(sponsor.name);
  }

}