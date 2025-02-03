import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerCardReaderComponent } from './player-card-reader.component';

describe('PlayerCardReaderComponent', () => {
  let component: PlayerCardReaderComponent;
  let fixture: ComponentFixture<PlayerCardReaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PlayerCardReaderComponent]
    });
    fixture = TestBed.createComponent(PlayerCardReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
