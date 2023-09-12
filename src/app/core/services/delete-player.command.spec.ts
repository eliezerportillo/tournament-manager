import { TestBed } from '@angular/core/testing';

import { DeletePlayerCommand } from './delete-player.command';

describe('DeletePlayerService', () => {
  let service: DeletePlayerCommand;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeletePlayerCommand);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
