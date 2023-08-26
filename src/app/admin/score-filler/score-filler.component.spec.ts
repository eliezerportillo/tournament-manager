import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreFillerComponent } from './score-filler.component';

describe('ScoreFillerComponent', () => {
  let component: ScoreFillerComponent;
  let fixture: ComponentFixture<ScoreFillerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScoreFillerComponent]
    });
    fixture = TestBed.createComponent(ScoreFillerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
