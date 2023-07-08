import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private audios: Map<string, HTMLAudioElement> = new Map();

  public static WRONG_SFX_NAME: string = 'WRONG-SFX';
  public static WRONG_HIGH_SFX_NAME: string = 'WRONG-HIGH-SFX';
  public static VICTORY_SFX_NAME: string = 'VICTORY-SFX';

  constructor() { 
    this.initAudio(AudioService.WRONG_SFX_NAME, '/assets/sounds/wrong.ogg');
    this.initAudio(AudioService.WRONG_HIGH_SFX_NAME, '/assets/sounds/wrong-high.ogg');
    this.initAudio(AudioService.VICTORY_SFX_NAME, '/assets/sounds/victory.ogg');
  }

  private initAudio(audioName: string, audioPath: string): void {
    const audio = new Audio();
    audio.src = audioPath;
    audio.load();
    audio.volume = 0.3;

    this.audios.set(audioName, audio);
  }

  public playAudio(audioName: string): void {
    const audio = this.audios.get(audioName);

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.play();
    }
  }
}


