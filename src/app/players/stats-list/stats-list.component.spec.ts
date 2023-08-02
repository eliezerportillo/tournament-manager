import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsListComponent } from './stats-list.component';

describe('StatsListComponent', () => {
  let component: StatsListComponent;
  let fixture: ComponentFixture<StatsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatsListComponent]
    });
    fixture = TestBed.createComponent(StatsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
