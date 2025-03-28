import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamPhotoCaptureViewComponent } from './team-photo-capture-view.component';

describe('TeamPhotoCaptureViewComponent', () => {
  let component: TeamPhotoCaptureViewComponent;
  let fixture: ComponentFixture<TeamPhotoCaptureViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamPhotoCaptureViewComponent]
    });
    fixture = TestBed.createComponent(TeamPhotoCaptureViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
