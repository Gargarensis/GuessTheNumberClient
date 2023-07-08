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

  public startNewGame(maxValue: number): Observable<string> {
    return this.httpClient.post<NewGameResponse>(environment.apiUrl + '/v1/games/new', { maxValue: maxValue }, this.authService.getAuthenticatedHeaders())
      .pipe(map(res => res.gameId as string));
  }

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