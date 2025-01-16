import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradientSectionComponent } from './gradient-section.component';

describe('GradientSectionComponent', () => {
  let component: GradientSectionComponent;
  let fixture: ComponentFixture<GradientSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GradientSectionComponent]
    });
    fixture = TestBed.createComponent(GradientSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
