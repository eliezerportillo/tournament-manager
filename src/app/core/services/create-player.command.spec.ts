import { TestBed } from '@angular/core/testing';

import { CreatePlayerCommand } from './create-player.command';

describe('CreatePlayerService', () => {
  let service: CreatePlayerCommand;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreatePlayerCommand);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
