import { Component } from '@angular/core';
import { GameStatus } from './game-status';
import { Observable, map, takeWhile, timer } from 'rxjs';
import { GameClientService } from './services/gameclient.service';
import { RecordService } from './services/records.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {  

  public attempts: number = 0;
  public timer: Observable<number> | undefined;
  private timerIsRunning: boolean = false;
  private currentTimeValue: number = 0;

  public gameStatus: GameStatus = GameStatus.STANDBY;
  public GameStatusType = GameStatus;
  public playingErrorAnimation: boolean = false;

  private gameId: string = '';

  public currentInput = 0;

  private highPitchedWrongSFX: HTMLAudioElement;
  private wrongSFX: HTMLAudioElement;

  constructor(
    private gameClient: GameClientService,
    private recordService: RecordService
    ) {

      this.wrongSFX = new Audio();
      this.wrongSFX.src = "/assets/sounds/wrong.ogg";
      this.wrongSFX.load();
      this.wrongSFX.volume = 0.3;

      this.highPitchedWrongSFX = new Audio();
      this.highPitchedWrongSFX.src = "/assets/sounds/wrong-high.ogg";
      this.highPitchedWrongSFX.load();
      this.highPitchedWrongSFX.volume = 0.3;
     }

  public startGame(): void {
    this.gameClient.startNewGame().subscribe(gameId => {
      this.timerIsRunning = true;
      this.timer = timer(0, 1000).pipe(
        map(n => n * 1000),
        takeWhile(n => n <= 100000000 && this.timerIsRunning),
      );

      this.timer.subscribe(n => this.currentTimeValue = n)

      this.gameId = gameId;
      this.gameStatus = GameStatus.STARTED;
    });
  }

  public sendInput(): void {
    this.gameClient.sendMoveToGame(this.gameId, this.currentInput).subscribe(gameState => {
      this.gameStatus = gameState;
      this.attempts += 1;

      if (gameState == GameStatus.GAME_WON) {
        this.timerIsRunning = false;
        this.recordService.saveRecordInLocalStorage(this.attempts, this.currentTimeValue);
      } else {
        this.setPlayingErrorAnimation(true);
        if (gameState == GameStatus.LAST_NUMBER_LOWER) {
          this.playSound(this.wrongSFX);
        } else {
          this.playSound(this.highPitchedWrongSFX);
        }
      }
    });
  }

  public playSound(audio: HTMLAudioElement) {
    audio.pause();
    audio.currentTime = 0;
    audio.play();
  }

  public isGameFinished(): boolean {
    return this.gameStatus == GameStatus.GAME_WON;
  }

  public playAgain(): void {
    this.attempts = 0;
    this.timer = undefined;
    this.timerIsRunning = false;
    this.currentTimeValue = 0;

    this.gameStatus = GameStatus.STANDBY;
    this.playingErrorAnimation = false;

    this.gameId = '';
    this.currentInput = 0;
  }

  public setPlayingErrorAnimation(value: boolean): void {
    this.playingErrorAnimation = value;
  }
}
