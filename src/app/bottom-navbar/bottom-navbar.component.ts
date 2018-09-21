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
 
  constructor(private btmNavMessageService: btmNavDataService) {}
  
  ngOnInit() {
    this.btmNavMessageService.currentMessage.subscribe(message => this.showProgress = message)
    
  }

}


 

  