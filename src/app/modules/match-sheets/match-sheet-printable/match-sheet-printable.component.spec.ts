import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchSheetPrintableComponent } from './match-sheet-printable.component';

describe('MatchSheetPrintableComponent', () => {
  let component: MatchSheetPrintableComponent;
  let fixture: ComponentFixture<MatchSheetPrintableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatchSheetPrintableComponent]
    });
    fixture = TestBed.createComponent(MatchSheetPrintableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
