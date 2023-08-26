import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchesViewComponent } from './matches-view.component';

describe('MatchListComponent', () => {
  let component: MatchesViewComponent;
  let fixture: ComponentFixture<MatchesViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatchesViewComponent]
    });
    fixture = TestBed.createComponent(MatchesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
