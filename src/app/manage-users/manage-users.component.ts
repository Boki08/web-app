import { Component, OnInit, Input, Pipe, Sanitizer } from '@angular/core';
import { UserServices } from '../services/user-services';
import { User } from '../models/user.model';
import { btmNavDataService } from '../bottom-navbar/btmNavDataService';
import { finalize } from 'rxjs/operators'
import { ToasterService } from '../toaster-service/toaster-service.component';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { TokenInterceptor } from '../interceptors/interceptors.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { Http, RequestOptions, ResponseContentType } from '@angular/http';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css'],
  providers: [{
    // register the interceptor to our angular module
    provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true
  }]
})

export class ManageUsersComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer, private toasterService: ToasterService, private btmNavMessageService: btmNavDataService, private UserServices: UserServices) { }

  pageSize: number = 5;

  img: SafeUrl = "/assets/images/default-placeholder.png";

  users: User[];
  managers: User[];
  userData: User;
  managerData: User;


  disableButtons: boolean = true;
  disableCheckButton: boolean = false;
  showUsers: boolean = false;
  showManagers: boolean = false;
  showUsersWarning: boolean = false;
  showManagersWarning: boolean = false;
  showProgress: boolean;
  userProgress: boolean;
  managerProgress: boolean = false;
  editedFirst: boolean = false;
  approvedFirst: boolean = false;
  isUser: boolean = true;
  enabledFirst: boolean = false;
  disabledFirst: boolean = false;
  showPicture: boolean = false;

  pageIndexU: number = 1;
  totalPagesNumberU: number = 0;
  pageIndexM: number = 1;
  totalPagesNumberM: number = 0;
  managerCounter: number;
  usercounter: number;

userEtag:string;

managerEtag:string;


  ngOnInit() {
    this.btmNavMessageService.currentMessage.subscribe(message => this.showProgress = message)
    this.getAllUsers("AppUser");
  }
  ngOnDestroy() {
    this.btmNavMessageService.changeMessage(false);
  }

  public getAllUsers(type: string) {
    this.btmNavMessageService.changeMessage(true);
    if (type == "AppUser") {
      this.UserServices.GetAllUsers(type, this.pageIndexU, this.pageSize, this.editedFirst, this.approvedFirst).pipe(finalize(
        () => {
          this.btmNavMessageService.changeMessage(false);
        }))
        .subscribe(
          data => {

            this.users = data.body as User[];


            let jsonData = JSON.parse(data.headers.get('Paging-Headers'));

            this.pageIndexU = jsonData.currentPage;
            this.pageSize = jsonData.pageSize;
            this.totalPagesNumberU = jsonData.totalPages;
            this.showUsers = true;
            this.showUsersWarning = false;

          },
          error => {
            if (error.error.Message === "There are no Users") {
              this.showUsers = false;
              this.showUsersWarning = true;
            }
            else {
              this.showUsersWarning = false;
              this.toasterService.Error(error.error.Message, 'Error');
            }

          })
    }
    else {//manager
      this.UserServices.GetAllUsers(type, this.pageIndexM, this.pageSize, this.enabledFirst, this.disabledFirst).pipe(finalize(
        () => {
          this.btmNavMessageService.changeMessage(false);
        }))
        .subscribe(
          data => {

            this.managers = data.body as User[];

            let jsonData = JSON.parse(data.headers.get('Paging-Headers'));

            this.pageIndexM = jsonData.currentPage;
            this.pageSize = jsonData.pageSize;
            this.totalPagesNumberM = jsonData.totalPages;

            this.showManagers = true;
            this.showManagersWarning = false;

          },
          error => {
            if (error.error.Message === "There are no Managers") {
              this.toasterService.Warning(error.error.Message, 'Warning');
              this.showManagers = false;
              this.showManagersWarning = true;
            }
            else {
              this.showManagersWarning = false;
              this.toasterService.Error(error.error.Message, 'Error');
            }
          })
    }
  }

  set pageU(val: number) {
    if (val !== this.pageIndexU) {

      this.pageIndexU = val;
      this.getAllUsers(this.selectedLink);
    }
  }
  set pageM(val: number) {
    if (val !== this.pageIndexM) {

      this.pageIndexM = val;
      this.getAllUsers(this.selectedLink);
    }
  }


  private selectedLink: string = "AppUser";

  setTab(value: string): void {
    this.getAllUsers(value);
    this.selectedLink = value;
    if (value == "AppUser") {
      this.isUser = true;
    }
    else {
      this.isUser = false;
    }

  }
  isSelected(name: string): boolean {

    if (this.selectedLink == name) {
      return true;
    }
    return false
  }

  userDetails(user: User, counter: number) {
    this.img  = "/assets/images/default-placeholder.png";
    this.userData = user;
    this.usercounter = counter;

    this.userProgress = true;

    this.UserServices.getProfileById(this.userData.UserId).pipe(finalize(
      () => {

      }))
      .subscribe(
        data => {
          this.userEtag = JSON.parse(data.headers.get('ETag'));
          this.userData=data.body;

          this.users[counter]=this.userData;

          this.UserServices.getImage(this.userData.DocumentPicture).pipe(finalize(
            () => {
              this.userProgress = false;
             
            }))
            .subscribe(
              data => {
                this.disableButtons = false;
                this.createImageFromBlob(data);
              },
              error => {
                this.toasterService.Error(error.error.Message, 'Error');
              })



        },
        error => {
          this.userProgress = false;
          this.toasterService.Error(error.error.Message, 'Error');
        })

   
  }
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.img = this.sanitizer.bypassSecurityTrustResourceUrl(reader.result as string);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }
  managerDetails(manager: User, counter: number) {
    this.managerData = manager;
    this.managerCounter = counter;

    this.disableCheckButton = true;

    this.managerProgress = true;

    this.UserServices.getProfileById(this.managerData.UserId).pipe(finalize(
      () => {
        this.managerProgress = false;
      }))
      .subscribe(
        data => {
          this.managerEtag = JSON.parse(data.headers.get('ETag'));
          this.managerData=data.body;
          this.disableCheckButton = false;

          this.managers[counter]=this.managerData;
        },
        error => {
          
          this.toasterService.Error(error.error.Message, 'Error');
        })
  }


  acceptUser( userID: number, activate: boolean) {
    this.userProgress = true;
    if (activate == true) {
      this.disableButtons = true;
    }
    this.UserServices.ActivateUser(userID, activate,this.userEtag).pipe(finalize(
      () => {
        this.userProgress = false;
      }))
      .subscribe(
        data => {
          this.userData = data.body;
          this.users[this.usercounter] = data.body;
          this.userEtag = JSON.parse(data.headers.get('ETag'));

          if (activate == true) {
            this.toasterService.Info("User was activated",'Info');
          }
          else{
            this.toasterService.Info("User was deactivated",'Info');
          }
         
        },
        error => {
          this.disableButtons = false;
          if(error.statusText== "Precondition Failed")
          {
            this.toasterService.Error("Data was already changed, please reload",'Error');
          }
          else
          {
          this.toasterService.Error(error.error.Message,'Error');
          }
          console.log(error);
        }
      )
  }

  setCheckBoxManager(event) {
    this.managerProgress = true;
    this.disableCheckButton = true;
    let managerEnabled: boolean;
    if (event.target.checked) {
      managerEnabled = true;
    }
    else {
      managerEnabled = false;
    }
    this.UserServices.ActivateUser(parseInt(this.managerData.UserId), managerEnabled,this.managerEtag).pipe(finalize(
      () => {
        this.disableCheckButton = false;
        this.managerProgress = false;
        this.btmNavMessageService.changeMessage(false);
      }))
      .subscribe(
        data => {
          this.managerEtag = JSON.parse(data.headers.get('ETag'));
          this.managerData = data.body;
          this.managers[this.managerCounter] = data.body;

          if (managerEnabled == true) {
            this.toasterService.Info("Manager was activated",'Info');
          }
          else{
            this.toasterService.Info("Manager was deactivated",'Info');
          }
         
        },
        error => {
          if(error.statusText== "Precondition Failed")
          {
            this.toasterService.Error("Data was already changed, please reload",'Error');
          }
          else
          {
          this.toasterService.Error(error.error.Message,'Error');
          }
          console.log(error);
        })
  }
  DeleteUser() {
    this.btmNavMessageService.changeMessage(true);
    this.UserServices.DeleteUser(parseInt(this.userData.UserId)).pipe(finalize(
      () => {
        this.btmNavMessageService.changeMessage(false);
      }))
      .subscribe(
        data => {
          this.users.splice[this.usercounter]
        },
        error => {
          if(error.statusText== "Precondition Failed")
          {
            this.toasterService.Error("Data was already changed, please reload",'Error');
          }
          else
          {
          this.toasterService.Error(error.error.Message,'Error');
          }
          console.log(error.Message);
        }
      )
  }

  setRadioUser(value: string): void {
    if (value == 'No') {
      this.editedFirst = false;
      this.approvedFirst = false;


    }
    else if (value == 'Approved') {
      this.editedFirst = false;
      this.approvedFirst = true;
    }
    else {
      this.editedFirst = true;
      this.approvedFirst = false;
    }
    this.getAllUsers("AppUser");

  }

  setRadioManager(value: string): void {
    if (value == 'No') {
      this.enabledFirst = false;
      this.disabledFirst = false;


    }
    else if (value == 'Enabled') {
      this.enabledFirst = false;
      this.disabledFirst = true;
    }
    else {
      this.enabledFirst = true;
      this.disabledFirst = false;
    }
    this.getAllUsers("AppUser");

  }
}
