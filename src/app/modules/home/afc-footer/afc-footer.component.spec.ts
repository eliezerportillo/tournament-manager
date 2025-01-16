import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfcFooterComponent } from './afc-footer.component';

describe('AfcFooterComponent', () => {
  let component: AfcFooterComponent;
  let fixture: ComponentFixture<AfcFooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AfcFooterComponent]
    });
    fixture = TestBed.createComponent(AfcFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
