import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchDateFilterPickerComponent } from './match-date-filter-picker.component';

describe('MatchDateFilterPickerComponent', () => {
  let component: MatchDateFilterPickerComponent;
  let fixture: ComponentFixture<MatchDateFilterPickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatchDateFilterPickerComponent]
    });
    fixture = TestBed.createComponent(MatchDateFilterPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
