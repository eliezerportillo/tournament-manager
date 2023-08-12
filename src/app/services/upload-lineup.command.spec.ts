import { TestBed } from '@angular/core/testing';

import { UploadLineupCommand } from './upload-lineup.command';

describe('UploadLineupService', () => {
  let service: UploadLineupCommand;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadLineupCommand);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
