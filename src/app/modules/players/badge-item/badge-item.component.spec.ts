import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeItemComponent } from './badge-item.component';

describe('BadgeItemComponent', () => {
  let component: BadgeItemComponent;
  let fixture: ComponentFixture<BadgeItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BadgeItemComponent]
    });
    fixture = TestBed.createComponent(BadgeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
