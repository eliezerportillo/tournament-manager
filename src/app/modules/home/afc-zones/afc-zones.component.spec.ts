import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfcZonesComponent } from './afc-zones.component';

describe('AfcZonesComponent', () => {
  let component: AfcZonesComponent;
  let fixture: ComponentFixture<AfcZonesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AfcZonesComponent]
    });
    fixture = TestBed.createComponent(AfcZonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
