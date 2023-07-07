import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GameStatus } from '../game-status';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GameClientService {

  private SERVER_URL: string = 'https://guessthenumber.azurewebsites.net';

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) { }

  public startNewGame(): Observable<string> {
    return this.httpClient.get<NewGameResponse>(this.SERVER_URL + '/game/new', this.authService.getAuthenticatedHeaders())
      .pipe(map(res => res.gameId as string));
  }

  public sendMoveToGame(gameId: string, input: number): Observable<GameStatus> {
    return this.httpClient.post<StatusUpdateResponse>(`${this.SERVER_URL}/game/${gameId}/input`, { chosenNumber: input }, this.authService.getAuthenticatedHeaders())
      .pipe(map(res => res.newStatus as GameStatus));
  }
}

interface NewGameResponse {
  gameId: string;
}

interface StatusUpdateResponse {
  newStatus: string;
}