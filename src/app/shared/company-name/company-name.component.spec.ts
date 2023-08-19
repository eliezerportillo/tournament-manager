import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyNameComponent } from './company-name.component';

describe('CompanyNameComponent', () => {
  let component: CompanyNameComponent;
  let fixture: ComponentFixture<CompanyNameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyNameComponent]
    });
    fixture = TestBed.createComponent(CompanyNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
