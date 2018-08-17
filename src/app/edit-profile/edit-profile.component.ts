import { Component, OnInit } from '@angular/core';
import { UserServices } from '../services/user-services';
import { User } from '../models/user.model';
import { NgForm } from '@angular/forms';
import { EditPassword } from '../models/editPassword';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  constructor(private userServices: UserServices) { }
  userData: User;
  fileToUpload : File = null;
  imageUrl: string = "/assets/images/default-placeholder.png"

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
  handleFileInput(file: FileList){
    this.fileToUpload = file.item(0);
    //Show image preview
    var reader = new FileReader();
    reader.onload = (event:any)=>{
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
  }
  onSubmit(appUser:User){
    console.log(appUser);
    
    appUser.Activated=false;
    appUser.UserId=this.userData.UserId;
    appUser.DocumentPicture=this.userData.DocumentPicture;
    this.userServices.EditUser(appUser,this.fileToUpload)
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
