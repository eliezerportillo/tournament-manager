import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoresViewComponent } from './scores-view.component';

describe('ScoresViewComponent', () => {
  let component: ScoresViewComponent;
  let fixture: ComponentFixture<ScoresViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScoresViewComponent]
    });
    fixture = TestBed.createComponent(ScoresViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
