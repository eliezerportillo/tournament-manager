import { TestBed } from '@angular/core/testing';

import { MatchScrollService } from './match-scroll.service';

describe('MatchScrollService', () => {
  let service: MatchScrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchScrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
