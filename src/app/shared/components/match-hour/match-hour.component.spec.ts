import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchHourComponent } from './match-hour.component';

describe('MatchHourComponent', () => {
  let component: MatchHourComponent;
  let fixture: ComponentFixture<MatchHourComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatchHourComponent]
    });
    fixture = TestBed.createComponent(MatchHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
