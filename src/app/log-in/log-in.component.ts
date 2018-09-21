import { Component, ViewChild, ElementRef, Output, EventEmitter, AfterContentInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LogInService } from '../services/log-in-service';
import { LogInData } from '../models/logInData';
import { UserServices } from '../services/user-services';
import { btmNavDataService } from '../bottom-navbar/btmNavDataService';
import { finalize } from 'rxjs/operators'
import { ToasterService } from '../toaster-service/toaster-service.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css'],
  providers: [LogInService]
})
export class LogInComponent implements AfterContentInit {

  isVisibleNotLogged: boolean = false;
  isVisibleLogged: boolean = false;
  name: string = "";
  @ViewChild('loggedButton') loggedButton: ElementRef;
  showProgress1: boolean = false;

  @Output()
  private loggedOutEvent: EventEmitter<number> = new EventEmitter<number>();



  constructor(private router: Router,private toasterService:ToasterService,private btmNavMessageService: btmNavDataService, private LogInService: LogInService, private UserService: UserServices) {
  }

  ngOnInit() {
    this.btmNavMessageService.currentMessage.subscribe(message => this.showProgress1 = message)
    this.btmNavMessageService.changeMessage(false);
  }
  ngOnDestroy() {
    this.btmNavMessageService.changeMessage(false);
  }
  ngAfterContentInit() {

    this.setUp();

  }
 
  setUp() {
    if (!localStorage.jwt) {
      this.isVisibleNotLogged = true;
      this.isVisibleLogged = false;
    }
    else {
      this.isVisibleNotLogged = false;
      

      let jwtData = localStorage.jwt.split('.')[1]
      let decodedJwtJsonData = window.atob(jwtData)
      let decodedJwtData = JSON.parse(decodedJwtJsonData)

      if (decodedJwtData.UserFullName != null && decodedJwtData.UserFullName != "") {
        this.name = decodedJwtData.UserFullName
      }
      else {
        this.name = decodedJwtData.role;
      }
      this.isVisibleLogged = true;

    }

  }
  onSubmit(user: LogInData, form: NgForm) {
    console.log(user);
    this.LogInService.getTheToken(user);
    form.reset();
    this.setUp();
  }

  logOut() {
    this.btmNavMessageService.changeMessage(true);
    this.UserService.LogOut().pipe(finalize(
      () => {
        this.btmNavMessageService.changeMessage(false);
        this.router.navigate(['/home']);
      }))
      .subscribe(
        data => {

          localStorage.removeItem("jwt");
          localStorage.removeItem("role");
          this.setUp();
          this.loggedOutEvent.emit();
          this.toasterService.Info("Logged Out",'Info');

        },
        error => {
          if (localStorage.jwt) { localStorage.removeItem("jwt"); }
          if (localStorage.role) { localStorage.removeItem("role"); }
          this.toasterService.Error(error.error.Message,'Error');
          this.setUp();
          this.loggedOutEvent.emit();

        }
      );
  }
}

