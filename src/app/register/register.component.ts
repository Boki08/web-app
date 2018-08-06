import { Component, OnInit } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  minDate={year: 1900, month: 1, day: 1};
  //minDate = new Date(1850, 0, 1);
  date = new Date();
  maxDate={year:this.date.getFullYear() ,month:  (this.date.getMonth() + 1) ,day:  this.date.getDate()};


  model;
  constructor() { }

  ngOnInit() {
  }

}
