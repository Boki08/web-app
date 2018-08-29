import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class btmNavDataService {

  private messageSource = new BehaviorSubject(true);
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: boolean) {
    this.messageSource.next(message)
  }

}
/* import { Injectable } from '@angular/core';
import { Observable,Subject} from 'rxjs';

@Injectable()
export class btmNavDataService {
    private subject = new Subject<any>();

    sendMessage(message: boolean) {
        this.subject.next({ text: message });
    }

    clearMessage() {
        this.subject.next();
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
} */