import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingPlayersListComponent } from './pending-players-list.component';

describe('PendingPlayersListComponent', () => {
  let component: PendingPlayersListComponent;
  let fixture: ComponentFixture<PendingPlayersListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingPlayersListComponent],
    });
    fixture = TestBed.createComponent(PendingPlayersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
