import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerPhotoCaptureViewComponent } from './player-photo-capture-view.component';

describe('PlayerPhotoCaptureViewComponent', () => {
  let component: PlayerPhotoCaptureViewComponent;
  let fixture: ComponentFixture<PlayerPhotoCaptureViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerPhotoCaptureViewComponent]
    });
    fixture = TestBed.createComponent(PlayerPhotoCaptureViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
