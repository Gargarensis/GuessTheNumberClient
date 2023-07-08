import { TestBed } from '@angular/core/testing';

import { GameClientService } from './gameclient.service';
import { HttpClientModule } from '@angular/common/http';

describe('GameclientService', () => {
  let service: GameClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [HttpClientModule]
    });
    service = TestBed.inject(GameClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
