import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineupViewerComponent } from './lineup-viewer.component';

describe('UploadLineupComponent', () => {
  let component: LineupViewerComponent;
  let fixture: ComponentFixture<LineupViewerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LineupViewerComponent]
    });
    fixture = TestBed.createComponent(LineupViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
