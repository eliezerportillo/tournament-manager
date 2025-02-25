import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchSheetViewComponent } from './match-sheet-view.component';

describe('MatchSheetViewComponent', () => {
  let component: MatchSheetViewComponent;
  let fixture: ComponentFixture<MatchSheetViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatchSheetViewComponent]
    });
    fixture = TestBed.createComponent(MatchSheetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
