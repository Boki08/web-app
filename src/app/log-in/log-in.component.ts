import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import {NgForm} from '@angular/forms';
import { Services } from '../services/services.component';


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css'],
  providers: [Services]
})
export class LogInComponent implements OnInit {


  constructor(private Service: Services) { 
  }

  ngOnInit() {
  }

  onSubmit(user: User, form: NgForm) {
    console.log(user);
    this.Service.getTheToken(`username=`+user.name+`&password=`+user.password+`&grant_type=password`);

    form.reset();
  }

}
