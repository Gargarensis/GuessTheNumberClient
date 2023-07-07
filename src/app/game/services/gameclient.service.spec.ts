import { TestBed } from '@angular/core/testing';

import { GameClientService } from './gameclient.service';

describe('GameclientService', () => {
  let service: GameClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
