import { TestBed } from '@angular/core/testing';

import { UpdateStandingsCommand } from './update-standings.command';

describe('UpdateStandingsService', () => {
  let service: UpdateStandingsCommand;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateStandingsCommand);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
