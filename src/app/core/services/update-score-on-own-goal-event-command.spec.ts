import { TestBed } from '@angular/core/testing';

import { UpdateScoreOnOwnGoalEventCommandService } from './update-score-on-own-goal-event-command.service';

describe('UpdateScoreOnOwnGoalEventCommandService', () => {
  let service: UpdateScoreOnOwnGoalEventCommandService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateScoreOnOwnGoalEventCommandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
