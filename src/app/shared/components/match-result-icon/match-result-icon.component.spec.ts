import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchResultIconComponent } from './match-result-icon.component';

describe('MatchResultIconComponent', () => {
  let component: MatchResultIconComponent;
  let fixture: ComponentFixture<MatchResultIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatchResultIconComponent]
    });
    fixture = TestBed.createComponent(MatchResultIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
