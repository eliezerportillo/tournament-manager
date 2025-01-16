import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CleanTournamentComponent } from './clean-tournament.component';

describe('CleanTournamentComponent', () => {
  let component: CleanTournamentComponent;
  let fixture: ComponentFixture<CleanTournamentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CleanTournamentComponent]
    });
    fixture = TestBed.createComponent(CleanTournamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
