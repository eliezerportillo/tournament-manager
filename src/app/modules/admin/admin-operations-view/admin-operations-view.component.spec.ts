import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOperationsViewComponent } from './admin-operations-view.component';

describe('AdminOperationsViewComponent', () => {
  let component: AdminOperationsViewComponent;
  let fixture: ComponentFixture<AdminOperationsViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminOperationsViewComponent]
    });
    fixture = TestBed.createComponent(AdminOperationsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
