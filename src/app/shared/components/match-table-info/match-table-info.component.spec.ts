import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchTableInfoComponent } from './match-table-info.component';

describe('MatchTableInfoComponent', () => {
  let component: MatchTableInfoComponent;
  let fixture: ComponentFixture<MatchTableInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatchTableInfoComponent]
    });
    fixture = TestBed.createComponent(MatchTableInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
