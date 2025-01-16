import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyShellComponent } from './empty-shell.component';

describe('EmptyShellComponent', () => {
  let component: EmptyShellComponent;
  let fixture: ComponentFixture<EmptyShellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmptyShellComponent]
    });
    fixture = TestBed.createComponent(EmptyShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
