import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorsBannerComponent } from './sponsors-banner.component';

describe('SponsorListComponent', () => {
  let component: SponsorsBannerComponent;
  let fixture: ComponentFixture<SponsorsBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SponsorsBannerComponent]
    });
    fixture = TestBed.createComponent(SponsorsBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
