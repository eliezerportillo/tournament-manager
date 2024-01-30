import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorHandlerModalComponent } from './error-handler-modal.component';

describe('ErrorHandlerModalComponent', () => {
  let component: ErrorHandlerModalComponent;
  let fixture: ComponentFixture<ErrorHandlerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorHandlerModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ErrorHandlerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
