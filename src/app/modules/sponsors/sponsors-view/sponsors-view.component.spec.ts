import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorsViewComponent } from './sponsors-view.component';

describe('SponsorsViewComponent', () => {
  let component: SponsorsViewComponent;
  let fixture: ComponentFixture<SponsorsViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SponsorsViewComponent]
    });
    fixture = TestBed.createComponent(SponsorsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
