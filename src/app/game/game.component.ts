import { Component } from '@angular/core';
import { GameStatus } from './game-status';
import { Observable, map, takeWhile, timer } from 'rxjs';
import { GameClientService } from './services/gameclient.service';
import { RecordService } from './services/records.service';
import { AudioService } from './services/sound.service';

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

  public difficulties = [
    {
      name: 'Easy',
      maxValue: 100,
      color: 'green'
    },
    {
      name: 'Medium',
      maxValue: 10000,
      color: 'goldenrod'
    },
    {
      name: 'Hard',
      maxValue: 1000000,
      color: 'red'
    }
  ];
  public selectedDifficultyName = this.difficulties[1].name;

  constructor(
    private gameClient: GameClientService,
    private recordService: RecordService,
    private audioService: AudioService
    ) {  }

  /* 
    Starts and initialize a new game asking the server for a new one 
    It also start the record timer
  */
  public startGame(): void {
    this.gameClient.startNewGame(this.getSelectedDifficulty().maxValue).subscribe(gameId => {
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

  /* 
    Sends the current user input to the server 
    Handle the response by:
      - updating the game status
      - increasing the attempts counter
      - save the records and stopping the game if won
      - playing the appropriate error sound and animation if the guessed number was wrong
  */
  public sendInput(): void {
    this.gameClient.sendMoveToGame(this.gameId, this.currentInput).subscribe(gameState => {
      this.gameStatus = gameState;
      this.attempts += 1;

      if (gameState == GameStatus.GAME_WON) {
        this.timerIsRunning = false;
        this.recordService.saveRecordInLocalStorage(this.attempts, this.currentTimeValue);
        this.audioService.playAudio(AudioService.VICTORY_SFX_NAME);
      } else {
        this.setPlayingErrorAnimation(true);
        if (gameState == GameStatus.LAST_NUMBER_LOWER) {
          this.audioService.playAudio(AudioService.WRONG_SFX_NAME);
        } else {
          this.audioService.playAudio(AudioService.WRONG_HIGH_SFX_NAME);
        }
      }
    });
  }

  /* Returns true if the game is finished, false otherwise */
  public isGameFinished(): boolean {
    return this.gameStatus == GameStatus.GAME_WON;
  }

  /* Resets the component's status and allow the user to play again */
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

  /* Plays or stops the input error animation */
  public setPlayingErrorAnimation(value: boolean): void {
    this.playingErrorAnimation = value;
  }

  /* Builds and returns the Telegram share link */ 
  public getTelegramShareLink(): string {
    return `https://t.me/share/url?url=${window.location.origin}&text=I held my breath for ${this.currentTimeValue / 1000} seconds and guessed the number in ${this.attempts} attempts!`;
  }

  /* Opens the Telegram share link in a new tab */
  // intended typo to avoid adblocker
  public goToShxarePage() {
    window.open(this.getTelegramShareLink(), '_blank');
  }

  /* Returns the selected difficulty for this game */
  public getSelectedDifficulty() {
    const difficulty = this.difficulties.find(diff => diff.name === this.selectedDifficultyName);

    if (!difficulty) {
      return this.difficulties[1];
    }

    return difficulty;
  }
}
