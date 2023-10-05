import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerPhotoComponent } from './player-photo.component';

describe('PlayerPhotoComponent', () => {
  let component: PlayerPhotoComponent;
  let fixture: ComponentFixture<PlayerPhotoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerPhotoComponent]
    });
    fixture = TestBed.createComponent(PlayerPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
