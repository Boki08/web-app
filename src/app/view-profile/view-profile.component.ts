import { Component, OnInit, Input } from '@angular/core';
import { User } from '../models/user.model';
import { UserServices } from '../services/user-services';
import { btmNavDataService } from '../bottom-navbar/btmNavDataService';
import { finalize } from 'rxjs/operators'

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {

  constructor(private btmNavMessageService: btmNavDataService, private userServices: UserServices) {
    
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
         
            this.userData = data;
            this.userData.BirthDate = data.BirthDate.slice(0, 10);
          
        },
        error => {
          alert(error.error.Message);
        }
      )
  }
  ngOnDestroy() {
    this.btmNavMessageService.changeMessage(false);
  }
}
