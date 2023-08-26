import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchHeaderComponent } from './match-header.component';

describe('MatchHeaderComponent', () => {
  let component: MatchHeaderComponent;
  let fixture: ComponentFixture<MatchHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatchHeaderComponent]
    });
    fixture = TestBed.createComponent(MatchHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
