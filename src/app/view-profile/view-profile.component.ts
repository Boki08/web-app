import { Component, OnInit, Input } from '@angular/core';
import { User } from '../models/user.model';
import { UserServices } from '../services/user-services';
import { btmNavDataService } from '../bottom-navbar/btmNavDataService';
import { finalize } from 'rxjs/operators'
import { ToasterService } from '../toaster-service/toaster-service.component';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {

  constructor(private toasterService:ToasterService,private btmNavMessageService: btmNavDataService, private userServices: UserServices) {
    
  }
  @Input()
  userData: User;
  showProgress: boolean = true;


  ngOnInit() {

    this.btmNavMessageService.currentMessage.subscribe(message => this.showProgress = message)

    this.btmNavMessageService.changeMessage(true);

    this.userServices.getProfile().pipe(finalize(
      () => {
        this.btmNavMessageService.changeMessage(false);
      }))
      .subscribe(
        data => {
         
            this.userData = data.body;
            this.userData.BirthDate = data.body.BirthDate.slice(0, 10);
          
        },
        error => {
         this.toasterService.Error(error.error.Message,'Error');
        }
      )
  }
  ngOnDestroy() {
    this.btmNavMessageService.changeMessage(false);
  }
  deleteProfile(){
    this.userServices.DeleteUser( parseInt(this.userData.UserId)).pipe(finalize(
      () => {
        this.btmNavMessageService.changeMessage(false);
      }))
      .subscribe(
        data => {
          localStorage.removeItem("jwt");
          localStorage.removeItem("role");
         
          this.toasterService.Info("Logged Out",'Info');
          let win = (window as any);
          win.location.reload();
          
        },
        error => {

         this.toasterService.Error(error.error.Message,'Error');
        }
      )
  }
}
