import { Component, OnInit, inject } from '@angular/core';

import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AccountService } from './core/services/account.service';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { environment } from '@app-environments/environment';
import { Analytics, logEvent } from '@angular/fire/analytics';
import { EventEmitterService } from '@app-core/services/event-emitter.service';
import { ModalService } from '@app-core/services/modal.service';
import { BannerService } from '@app-core/services/banner.service';
import { BannerComponent } from '@app-shared/components/banner/banner.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  analytics?: Analytics;

  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private titleService: Title = inject(Title);
  private eventEmitterService: EventEmitterService = inject(EventEmitterService);
  private accountService: AccountService = inject(AccountService);
  

  modalService = inject(ModalService);
  bannerService = inject(BannerService);

  constructor() {
    
  }

  ngOnInit(): void {

    // Subscribe to app events
    this.eventEmitterService.sponsorClicked.subscribe(sponsorName => this.handleSponsorClicked(sponsorName));
    // Alternatively, you can also subscribe to NavigationEnd event
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateTitle();
    });
    const app = initializeApp(environment.firebaseConfig);
    this.analytics = getAnalytics(app);

    this.handleBanner()

  }


  handleBanner() {
    this.bannerService.getActiveBanners().subscribe(banners => {
      if (banners.length > 0) {
        this.modalService.open(BannerComponent, {banners});
      }
    })
  }

  handleSponsorClicked(sponsorName: string): void {
    if (this.analytics) {
      logEvent(this.analytics, `sponsor_clicked: ${sponsorName}`);
    }
  }

  // private analytics() {
  //   const app = initializeApp(environment.firebaseConfig);
  //   const analytics = getAnalytics(app);
  // }

  private updateTitle() {
    const pageTitle = this.getTitle(this.route);
    if (pageTitle) {
      this.titleService.setTitle(`${pageTitle} | ${this.accountService.companyName}`);
    }
  }

  private getTitle(route: ActivatedRoute): string | null {
    const data = route.snapshot.data;
    if (data && data['title']) {
      return data['title'];
    }

    if (route.firstChild) {
      return this.getTitle(route.firstChild);
    }

    return null;
  }


}

