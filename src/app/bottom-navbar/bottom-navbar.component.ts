import { Component, OnInit } from '@angular/core';
import { btmNavDataService } from './btmNavDataService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bottom-navbar',
  templateUrl: './bottom-navbar.component.html',
  styleUrls: ['./bottom-navbar.component.css']
})
export class BottomNavbarComponent implements OnInit {
  message:string;
  showProgress: boolean = false; 
  //subscription: Subscription;
  constructor(private btmNavMessageService: btmNavDataService) {
    //this.subscription = this.btmNavMessageService.getMessage().subscribe(message => { this.showProgress = message; });
  }
  
  ngOnInit() {
    this.btmNavMessageService.currentMessage.subscribe(message => this.showProgress = message)
    
  }
  
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    //this.subscription.unsubscribe();
}
}


 

  