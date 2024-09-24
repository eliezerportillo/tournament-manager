import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorsWidgetComponent } from './sponsors-widget.component';

describe('SponsorsWidgetComponent', () => {
  let component: SponsorsWidgetComponent;
  let fixture: ComponentFixture<SponsorsWidgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SponsorsWidgetComponent]
    });
    fixture = TestBed.createComponent(SponsorsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
