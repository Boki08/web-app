import { Component, OnInit } from '@angular/core';
import { EditPassword } from '../models/editPassword';
import { UserServices } from '../services/user-services';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  constructor(private userServices: UserServices) { }

  ngOnInit() {
  }
  onSubmitPassword(newPassword:EditPassword){
    console.log(newPassword);
    
    this.userServices.EditPassword1(newPassword)
    .subscribe(
      data=>{
        alert("Your changes updated successfully");
      },
      error=>{
        alert(error.error.ModelState[""][0]);
      }
    );
  }
}
