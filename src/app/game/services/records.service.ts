import { Injectable } from '@angular/core';


/* Service to handle the user records, saved in the local storage */
@Injectable({
  providedIn: 'root'
})
export class RecordService {

  private LOCALSTORAGE_RECORD_ATTEMPTS_KEY: string = 'attempts';
  private LOCALSTORAGE_RECORD_TIME_KEY: string = 'time';

  constructor() { }

  /* Updates or add the records to the local storage if they are better than the already present ones */
  public saveRecordInLocalStorage(attempts: number, time: number) {
    const oldAttempts: number = Number(localStorage.getItem(this.LOCALSTORAGE_RECORD_ATTEMPTS_KEY) || NaN);
    const oldTime: number = Number(localStorage.getItem(this.LOCALSTORAGE_RECORD_TIME_KEY) || NaN);

    if (isNaN(oldAttempts) || attempts < oldAttempts) {
        localStorage.setItem(this.LOCALSTORAGE_RECORD_ATTEMPTS_KEY, attempts.toString());
    }

    if (isNaN(oldTime) || time < oldTime) {
        localStorage.setItem(this.LOCALSTORAGE_RECORD_TIME_KEY, time.toString());
    }
  }

  /* Returns the record number of attempts */
  public getRecordAttempts(): number {
    return Number(localStorage.getItem(this.LOCALSTORAGE_RECORD_ATTEMPTS_KEY) || NaN);
  }

  /* Returns the record time */
  public getRecordTime(): number {
    return Number(localStorage.getItem(this.LOCALSTORAGE_RECORD_TIME_KEY) || NaN);
  }

}


