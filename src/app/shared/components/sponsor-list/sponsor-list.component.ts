import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild, inject, AfterViewInit, OnDestroy } from '@angular/core';
import { ISponsor } from 'src/app/models/sponsor';
import { SponsorService } from 'src/app/services/sponsor.service';
import { firstValueFrom, map } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-sponsor-list',
  templateUrl: './sponsor-list.component.html',
  styleUrls: ['./sponsor-list.component.scss']
})
export class SponsorListComponent implements OnInit, AfterViewInit, OnDestroy {

  currentPage = 0;
  itemsPerPage = 1;
  interval: any; // To hold the interval reference

  @Input()
  sponsors: ISponsor[] = [
    {
      name: 'Ledezmart',
      priority: 3,
      website: 'https://www.ledezmart.com/',
      logoUrl: 'assets/ledezmart.png'
    },
    {
      name: 'Netploy',
      priority: 4,
      website: 'https://www.facebook.com/netploy.solutions',
      logoUrl: 'assets/netploy.png'
    },
    {
      name: 'IAFCJ',
      priority: 2,
      website: 'https://www.iafcj.org/',
      logoUrl: 'assets/iafcj.png'
    },
    {
      name: 'COMUDE',
      priority: 1,
      website: 'https://www.iafcj.org/',
      logoUrl: 'assets/comude.png'
    },
    // {
    //   nombre: 'addidas',
    //   prioridad: 1,
    //   sitio: 'https://www.adidas.co.uk/football',
    //   imageUrl: 'https://digitalhub.fifa.com/m/45c63e2e1a57b617/webimage-fifa_fp_adidas-co_lbgr.png'
    // },
    // {
    //   nombre: 'Coca-Cola',
    //   prioridad: 2,
    //   sitio: 'https://www.coca-colamexico.com.mx/',
    //   imageUrl: 'https://digitalhub.fifa.com/m/405f79d35c1286a9/webimage-fifa_fp_cocacola-co_lgbr.png'
    // },
  ]

  private breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  sponsorService: SponsorService = inject(SponsorService);
  private renderer: Renderer2 = inject(Renderer2);
  @ViewChild('logoCarousel', { static: true }) logoCarouselRef!: ElementRef;
  intervalProgress: any;
  progress: number = 0;
  paused: boolean = false;
  ngOnInit(): void {
    this.checkBreakpoint();
    this.load();
    this.startTimer();
  }

  get canShowProgressBar() {
    return this.sponsors.length > this.itemsPerPage;
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

  ngAfterViewInit() {
    // const logoCarousel = this.logoCarouselRef.nativeElement;

    // this.renderer.listen(logoCarousel, 'animationiteration', () => {
    //   // This event is fired when the animation completes a loop
    //   // You can add your logic here, e.g., hide the carousel
    //   // this.renderer. setStyle(logoCarousel.parentElement, 'display', 'none');

    //   this.renderer.removeChild(logoCarousel.parentElement, logoCarousel);
    // });
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
    // const sp = this.sponsorService.get().pipe(map(sponsors => sponsors.sort((a, b) => a.prioridad - b.prioridad)))
    // this.sponsors = await firstValueFrom(sp);    
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

}