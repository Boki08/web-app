import { Component, OnInit, Input } from '@angular/core';
import { User } from '../models/user.model';
import { UserServices } from '../services/user-services';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {

  constructor(private userServices: UserServices) { }
  @Input()
  userData: User;
  
  ngOnInit() {
    this.userServices.getProfile()
    .subscribe(
      data => {
        this.userData = data;
        this.userData.BirthDate = data.BirthDate.slice(0,10);
      },
      error => {
        alert(error.error.ModelState[""][0]);
      }
    )
  }

}
