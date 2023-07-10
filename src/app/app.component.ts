import { Component } from '@angular/core';
import { RecordService } from './game/services/records.service';
import { DatePipe } from '@angular/common';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    public recordService: RecordService,
    private datePipe: DatePipe,
    public authService: AuthService) { }

  
  /* Getters for records */
  
  public getRecordAttempts(): number {
    return this.recordService.getRecordAttempts();
  }

  public getRecordTime(): number {
    return this.recordService.getRecordTime();
  }

  public getFormattedTime(): string {
    return this.datePipe.transform(this.getRecordTime(), 'mm:ss') || '';
  }


  /* Checks if we can show the records */

  public canShowAttempts(): boolean {
    return !isNaN(this.getRecordAttempts());
  }

  public canShowTime(): boolean {
    return !isNaN(this.getRecordTime());
  }
}
