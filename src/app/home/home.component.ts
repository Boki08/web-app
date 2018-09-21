import { Component, OnInit } from '@angular/core';
import { btmNavDataService } from '../bottom-navbar/btmNavDataService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router,private btmNavMessageService: btmNavDataService) { }
  showProgress:boolean=false;
  ngOnInit() {
    this.btmNavMessageService.currentMessage.subscribe(message => this.showProgress = message)
    this.btmNavMessageService.changeMessage(true);
    this.btmNavMessageService.changeMessage(false);


    if (localStorage.jwt && localStorage.role == "Admin") {
      this.router.navigate(['/manageUsers']);
    }
    else  if (localStorage.jwt && localStorage.role == "Manager") {
      this.router.navigate(['/editServicesComponent']);
    }
    else  if (localStorage.jwt && localStorage.role == "AppUser") {
      this.router.navigate(['/rentServices']);
    }
    else {
      this.router.navigate(['/rentServices']);
    }



    
   
  }
  ngOnDestroy() {
    this.btmNavMessageService.changeMessage(false);
  }

}
