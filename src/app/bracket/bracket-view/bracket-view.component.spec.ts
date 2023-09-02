import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BracketViewComponent } from './bracket-view.component';

describe('BracketViewComponent', () => {
  let component: BracketViewComponent;
  let fixture: ComponentFixture<BracketViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BracketViewComponent]
    });
    fixture = TestBed.createComponent(BracketViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
