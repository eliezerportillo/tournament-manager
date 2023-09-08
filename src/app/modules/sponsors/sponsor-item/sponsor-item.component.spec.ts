import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorItemComponent } from './sponsor-item.component';

describe('SponsorItemComponent', () => {
  let component: SponsorItemComponent;
  let fixture: ComponentFixture<SponsorItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SponsorItemComponent]
    });
    fixture = TestBed.createComponent(SponsorItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
