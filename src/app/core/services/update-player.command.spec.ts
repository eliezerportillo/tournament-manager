import { TestBed } from '@angular/core/testing';

import { UpdatePlayerCommand } from './update-player.command';

describe('UpdatePlayerService', () => {
  let service: UpdatePlayerCommand;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdatePlayerCommand);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
