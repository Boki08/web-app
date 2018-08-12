import { Component, OnInit } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {User} from '../models/user.model'
import {NgForm} from '@angular/forms';
import { UserServices } from '../services/user-services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  minDate="1900-1-1";
  //minDate = new Date(1850, 0, 1);
  date = new Date();
  maxDate=this.date.getFullYear()+ "-"+  (this.date.getMonth() + 1)+"-"+ this.date.getDate();


  model;
  constructor(private UserService: UserServices)  { }

  ngOnInit() {
  }
  onSubmit(user: User, form: NgForm) {
    console.log(user);
    //user.birthDate=/* JSON.stringify(user.birthDate) */user.birthDate["year"]+'-'+user.birthDate["month"]+'-'+user.birthDate["day"]+'T00:00:00';
    this.UserService.register(user).subscribe(
      data => {
        //this.methodResult = data;
       // alert("POST: id: " + this.methodResult.id + ", userId: " + this.methodResult.userId + ", title: " + this.methodResult.title + ", body: " + this.methodResult.body);
      },
      error => {
        console.log(error);
      })
    form.reset();
  }

}
