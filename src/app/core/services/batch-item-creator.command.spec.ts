import { TestBed } from '@angular/core/testing';

import { BatchItemCreatorCommand } from './batch-item-creator.command';

describe('BatchItemCreatorService', () => {
  let service: BatchItemCreatorCommand;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BatchItemCreatorCommand);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
