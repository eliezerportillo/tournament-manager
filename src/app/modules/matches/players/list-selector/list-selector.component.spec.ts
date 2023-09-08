import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSelectorComponent } from './list-selector.component';

describe('ListSelectorComponent', () => {
  let component: ListSelectorComponent;
  let fixture: ComponentFixture<ListSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListSelectorComponent]
    });
    fixture = TestBed.createComponent(ListSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
