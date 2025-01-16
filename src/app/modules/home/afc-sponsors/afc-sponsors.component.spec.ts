import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfcSponsorsComponent } from './afc-sponsors.component';

describe('AfcSponsorsComponent', () => {
  let component: AfcSponsorsComponent;
  let fixture: ComponentFixture<AfcSponsorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AfcSponsorsComponent]
    });
    fixture = TestBed.createComponent(AfcSponsorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
