import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamFairPlayListComponent } from './team-fair-play-list.component';

describe('TeamFairPlayListComponent', () => {
  let component: TeamFairPlayListComponent;
  let fixture: ComponentFixture<TeamFairPlayListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamFairPlayListComponent]
    });
    fixture = TestBed.createComponent(TeamFairPlayListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
