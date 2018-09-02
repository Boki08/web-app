import { Component, OnInit } from '@angular/core';
import { btmNavDataService } from '../bottom-navbar/btmNavDataService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private btmNavMessageService: btmNavDataService) { }
  showProgress:boolean=false;
  ngOnInit() {
    this.btmNavMessageService.currentMessage.subscribe(message => this.showProgress = message)
  }
  ngOnDestroy() {
    this.btmNavMessageService.changeMessage(false);
  }

}
