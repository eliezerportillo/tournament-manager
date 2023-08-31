import { Component, OnInit, inject } from '@angular/core';

import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AccountService } from './services/account.service';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  analytics: any;

  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private titleService: Title = inject(Title);
  private accountService: AccountService = inject(AccountService);
  tounamentName: string;

  constructor() {
    this.tounamentName = this.accountService.getTournamentName();

  }

  ngOnInit(): void {


    // Alternatively, you can also subscribe to NavigationEnd event
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateTitle();
      // this.analytics();
    });
    const app = initializeApp(environment.firebaseConfig);
    this.analytics = getAnalytics(app);

    // logEvent(analytics, 'screen_view', {
    //   firebase_screen: screenName, 
    //   firebase_screen_class: screenClass
    // });
  }

  // private analytics() {
  //   const app = initializeApp(environment.firebaseConfig);
  //   const analytics = getAnalytics(app);
  // }

  private updateTitle() {
    const pageTitle = this.getTitle(this.route);
    if (pageTitle) {
      this.titleService.setTitle(`${pageTitle} | ${this.tounamentName}`);
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

