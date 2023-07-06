import { TestBed } from '@angular/core/testing';

import { GameclientService } from './gameclient.service';

describe('GameclientService', () => {
  let service: GameclientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameclientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
