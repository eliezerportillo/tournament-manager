import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadLineupComponent } from './upload-lineup.component';

describe('UploadLineupComponent', () => {
  let component: UploadLineupComponent;
  let fixture: ComponentFixture<UploadLineupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadLineupComponent]
    });
    fixture = TestBed.createComponent(UploadLineupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
