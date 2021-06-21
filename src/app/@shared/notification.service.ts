import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  public alertsDismiss: any = [];
  lunchNotification: EventEmitter<any> = new EventEmitter();

  constructor() {}

  onNotificationEvent() {
    return this.lunchNotification;
  }

  initNotification(type: string, msg: string) {
    this.alertsDismiss.push({
      type: type,
      msg: msg,
      timeout: 5000,
    });
    this.lunchNotification.emit(this.alertsDismiss);
  }
}
