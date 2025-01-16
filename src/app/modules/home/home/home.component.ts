import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CarouselComponent } from '../carousel/carousel.component';
import { GradientSectionComponent } from '../gradient-section/gradient-section.component';
import { AfcZonesComponent } from '../afc-zones/afc-zones.component';
import { AfcSponsorsComponent } from '../afc-sponsors/afc-sponsors.component';
import { AfcFooterComponent } from '../afc-footer/afc-footer.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatCardModule,
    FlexLayoutModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    CarouselComponent,
    GradientSectionComponent,
    AfcZonesComponent,
    AfcSponsorsComponent,
    AfcFooterComponent]
})
export class HomeComponent implements AfterViewInit, OnInit {
  isLargeScreen: boolean = false;
  images = [
    "https://firebasestorage.googleapis.com/v0/b/afc-torneo.appspot.com/o/images%2Fbanners%2Fbanner%20afc%20campeon.jpg?alt=media&token=80af6800-9138-46fa-9622-094c4e0dee37",
    "https://firebasestorage.googleapis.com/v0/b/afc-torneo.appspot.com/o/images%2Fbanners%2Fbanner%20afc%203.jpg?alt=media&token=94269e12-fabb-4c7d-be8c-fad5c31b036a",
    "https://firebasestorage.googleapis.com/v0/b/afc-torneo.appspot.com/o/images%2Fbanners%2Fbanner%20afc%205.jpg?alt=media&token=20f77f39-7237-4404-b3b3-9d367f9e70cd",
  ]
  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    // this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
    //   .subscribe(result => {
    //     this.isLargeScreen = false;
    //   });
    //   this.breakpointObserver.observe([Breakpoints.Large])
    //   .subscribe(result => {
    //     this.isLargeScreen = true;
    //   });
  }
  ngAfterViewInit() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const href = link.getAttribute('href');
        const targetId = href ? href.substring(1) : '';
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
}