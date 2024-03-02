import { TestBed } from '@angular/core/testing';

import { CleanOldBadgesCommand } from './clean-old-badges.command';

describe('CleanOldBadgesService', () => {
  let service: CleanOldBadgesCommand;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CleanOldBadgesCommand);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
