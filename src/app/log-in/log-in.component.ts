import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter, AfterContentInit } from '@angular/core';
import { User } from '../models/user.model';
import { NgForm } from '@angular/forms';
import { LogInService } from '../services/log-in-service';
import { LogInData } from '../models/logInData';
import { UserServices } from '../services/user-services';
import { btmNavDataService } from '../bottom-navbar/btmNavDataService';
import { finalize } from 'rxjs/operators'
import { ToasterService } from '../toaster-service/toaster-service.component';


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



  constructor(private toasterService:ToasterService,private btmNavMessageService: btmNavDataService, private LogInService: LogInService, private UserService: UserServices) {
  }

  ngOnInit() {
    this.btmNavMessageService.currentMessage.subscribe(message => this.showProgress1 = message)
    this.btmNavMessageService.changeMessage(false);
   // this.testJwt();??
  }
  ngOnDestroy() {
    this.btmNavMessageService.changeMessage(false);
  }
  ngAfterContentInit() {

    this.setUp();

  }
 /*  testJwt() {
    if (!localStorage.jwt) {
      this.isVisibleNotLogged = true;
      this.isVisibleLogged = false;
    }
    else {
      this.isVisibleNotLogged = false;
      this.isVisibleLogged = true;
    }
  } */
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

      //this.loggedButton.nativeElement.innerHTML = this.name;
    }

  }
  onSubmit(user: LogInData, form: NgForm) {
    console.log(user);
    this.LogInService.getTheToken(user);
    form.reset();
    this.setUp();
  }
  /*   getUser() {
      this.UserService.getProfile().subscribe(
        res => {
          let data = res;
  
        });
    } */
  logOut() {
    this.btmNavMessageService.changeMessage(true);
    this.UserService.LogOut().pipe(finalize(
      () => {
        this.btmNavMessageService.changeMessage(false);
      }))
      .subscribe(
        data => {

          localStorage.removeItem("jwt");
          localStorage.removeItem("role");
          this.setUp();
          this.loggedOutEvent.emit();
          this.toasterService.Info("Logged Out",'Info');
          //alert("Logged out");

        },
        error => {
          if (localStorage.jwt) { localStorage.removeItem("jwt"); }
          if (localStorage.role) { localStorage.removeItem("role"); }
          //alert(error.error.Message);
          this.toasterService.Error(error.error.Message,'Error');
          this.setUp();
          this.loggedOutEvent.emit();

        }
      );
  }
}

