import { Component, OnInit, NgZone } from '@angular/core';
import { SignalRService } from '../services/signal-r.service';
import { ToasterService } from '../toaster-service/toaster-service.component';

declare var $: any;

@Component({
  selector: 'app-get-notification',
  templateUrl: './get-notification.component.html',
  styleUrls: ['./get-notification.component.css']
})

export class GetNotificationComponent implements OnInit {
  public currentMessage: string;  
 
  public canSendMessage: Boolean;  
  // constructor of the class to inject the service in the constuctor and call events.  
  constructor(private toasterService:ToasterService,private _signalRService: SignalRService, private _ngZone: NgZone) {    
      this.canSendMessage = false;  
    }
    messages:Message[]=[new Message('asas','info')];
  ngOnInit()
  {
    
    this.checkConnection();
    this.subscribeForNotifications();
  }
 
  private checkConnection(){
    this._signalRService.connectionEstablished.subscribe(e => {this.canSendMessage = e;
        if (e) {
          this._signalRService.sendHello()
        }
    });
  }
 
  private subscribeForNotifications () {
    this._signalRService.messageReceived.subscribe(e => this.onNotification(e));
  }
 
  public onNotification(notif: string) {
    
         this._ngZone.run(() => {
      
           if(localStorage.role == 'Admin'){
             //alert(notif);
             this.toasterService.Info(notif,'Info');

             /* let len=this.messages.push(new Message(notif,'info'));
             if(len>3){
               this.messages.pop();
             } */
           }
        });  
  }
/* 
  Info(){
    this.toasterService.Info("hii",'title');
  } */
}

export class Message {
  content: string;
  style: string;
  dismissed: boolean = false;

  constructor(content, style?) {
    this.content = content
    this.style = style || 'info'
  }
}