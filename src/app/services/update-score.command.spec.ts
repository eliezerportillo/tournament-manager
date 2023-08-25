import { TestBed } from '@angular/core/testing';
import { UpdateScoreCommand } from './update-score.command';



describe('UpdateScoreService', () => {
  let service: UpdateScoreCommand;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateScoreCommand);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
