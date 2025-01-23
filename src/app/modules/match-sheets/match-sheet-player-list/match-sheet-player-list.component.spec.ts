import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchSheetPlayerListComponent } from './match-sheet-player-list.component';

describe('MatchSheetPlayerListComponent', () => {
  let component: MatchSheetPlayerListComponent;
  let fixture: ComponentFixture<MatchSheetPlayerListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatchSheetPlayerListComponent]
    });
    fixture = TestBed.createComponent(MatchSheetPlayerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
