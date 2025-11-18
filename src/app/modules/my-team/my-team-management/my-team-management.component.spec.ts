import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTeamManagementComponent } from './my-team-management.component';

describe('MyTeamManagementComponent', () => {
  let component: MyTeamManagementComponent;
  let fixture: ComponentFixture<MyTeamManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyTeamManagementComponent],
    });
    fixture = TestBed.createComponent(MyTeamManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
