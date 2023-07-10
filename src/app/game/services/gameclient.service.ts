import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GameStatus } from '../game-status';
import { AuthService } from '../../auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameClientService {

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) { }

  /* 
    Performs an HTTP request to the server to create a new game with the desired difficulty level (maxValue parameter)
    Returns an Observable that emits the game id returned by the server when the game has been successfully created
  */
  public startNewGame(maxValue: number): Observable<string> {
    return this.httpClient.post<NewGameResponse>(environment.apiUrl + '/v1/games/new', { maxValue: maxValue }, this.authService.getAuthenticatedHeaders())
      .pipe(map(res => res.gameId as string));
  }

  /* 
    Performs an HTTP request to the server with the user move 
    Returns an Observable that emits the new game status once the move has been processed
  */
  public sendMoveToGame(gameId: string, input: number): Observable<GameStatus> {
    return this.httpClient.post<StatusUpdateResponse>(`${environment.apiUrl}/v1/games/${gameId}/input`, { chosenNumber: input }, this.authService.getAuthenticatedHeaders())
      .pipe(map(res => res.newStatus as GameStatus));
  }
}

interface NewGameResponse {
  gameId: string;
}

interface StatusUpdateResponse {
  newStatus: string;
}