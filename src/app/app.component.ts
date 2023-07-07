import { Component } from '@angular/core';
import { RecordService } from './game/services/records.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    public recordService: RecordService,
    private datePipe: DatePipe) { }

  public getRecordAttempts(): number {
    return this.recordService.getRecordAttempts();
  }

  public getRecordTime(): number {
    return this.recordService.getRecordTime();
  }

  public getFormattedTime(): string {
    return this.datePipe.transform(this.getRecordTime(), 'mm:ss') || '';
  }

  public canShowAttempts(): boolean {
    return !isNaN(this.getRecordAttempts());
  }

  public canShowTime(): boolean {
    return !isNaN(this.getRecordTime());
  }
}
