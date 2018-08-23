import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { User } from '../models/user.model';
import { NgForm } from '@angular/forms';
import { LogInService } from '../services/log-in-service';
import { LogInData } from '../models/logInData';
import { UserServices } from '../services/user-services';


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css'],
  providers: [LogInService]
})
export class LogInComponent implements AfterViewInit {

  isVisibleNotLogged: boolean;
  isVisibleLogged: boolean;
  name: string = "-1";
  @ViewChild('loggedButton') loggedButton: ElementRef;

  @Output()
  private loggedOutEvent:EventEmitter<number>= new EventEmitter<number>();

 

  constructor(private LogInService: LogInService, private UserService: UserServices) {
  }

  ngOnInit() {
    if (!localStorage.jwt) {
      this.isVisibleNotLogged = true;
      this.isVisibleLogged = false;
    }
    else {
      this.isVisibleNotLogged = false;
      this.isVisibleLogged = true;
    }
  }

  ngAfterViewInit() {

    this.setUp();

  }
  setUp() {
    if (!localStorage.jwt) {
      this.isVisibleNotLogged = true;
      this.isVisibleLogged = false;
    }
    else {
      this.isVisibleNotLogged = false;
      this.isVisibleLogged = true;

      let jwtData = localStorage.jwt.split('.')[1]
      let decodedJwtJsonData = window.atob(jwtData)
      let decodedJwtData = JSON.parse(decodedJwtJsonData)

      this.name = decodedJwtData.UserFullName


      this.loggedButton.nativeElement.innerHTML = this.name;
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
  logOut(){
    this.UserService.LogOut()
    .subscribe(
      data=>{

        localStorage.removeItem("jwt");
        localStorage.removeItem("role");
        this.setUp();
        this.loggedOutEvent.emit();
        alert("Logged out");
      },
      error=>{
        alert(error.error.ModelState[""][0]);
      }
    );
  }
}

