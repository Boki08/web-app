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

  constructor(private sanitizer: DomSanitizer,private toasterService: ToasterService, private btmNavMessageService: btmNavDataService, private UserServices: UserServices) { }

  pageSize: number = 5;

  img:SafeUrl="/assets/images/default-placeholder.png";

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
  showPicture:boolean=false;

  pageIndexU: number = 1;
  totalPagesNumberU: number = 0;
  pageIndexM: number = 1;
  totalPagesNumberM: number = 0;
  managerCounter: number;
  usercounter: number;


  


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
            /* if (this.users.length > 0) { */
            //this.userData=this.users[0];

            let jsonData = JSON.parse(data.headers.get('Paging-Headers'));

            this.pageIndexU = jsonData.currentPage;
            this.pageSize = jsonData.pageSize;
            this.totalPagesNumberU = jsonData.totalPages;
            this.showUsers = true;
            this.showUsersWarning = false;
            /*  }
             else {
               this.showUsers = false;
 
             } */
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
            //console.log(error);
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
            //this.userData=this.users[0];
            /*  if (this.managers.length > 0) { */
            let jsonData = JSON.parse(data.headers.get('Paging-Headers'));

            this.pageIndexM = jsonData.currentPage;
            this.pageSize = jsonData.pageSize;
            this.totalPagesNumberM = jsonData.totalPages;

            this.showManagers = true;
            this.showManagersWarning = false;
            /* }
            else {
              this.showManagers = false;

            } */
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
    // if(value=="AppUSer")//za vracanje na 0, zbog pamcenja paginacije??
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
    this.userData = user;
    this.usercounter = counter;

    this.userProgress = true;
    

    this.UserServices.getImage(this.userData.DocumentPicture).pipe(finalize(
      () => {
        this.userProgress = false;
     
          this.disableButtons = false;
        
      }))
      .subscribe(
        data => {
this.createImageFromBlob(data);

        },
        error => {
          /* if (error.error.Message === "There are no Users") {
            this.showUsers = false;
            this.showUsersWarning = true;
          }
          else {
            this.showUsersWarning = false; */
            this.toasterService.Error(error.error.Message, 'Error');
         /*  } */
          //console.log(error);
        })
  }
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
       this.img =  this.sanitizer.bypassSecurityTrustResourceUrl(reader.result as string);
    }, false);
 
    if (image) {
       reader.readAsDataURL(image);
    }
 }
  managerDetails(manager: User, counter: number) {
    this.managerData = manager;
    this.managerCounter = counter;
  }


  acceptUser(counter: number, userID: number, activate: boolean) {//enable/disable user
    this.userProgress = true;
    if (activate == true) {
      this.disableButtons = true;
    }
    this.UserServices.ActivateUser(userID, activate).pipe(finalize(
      () => {
        this.userProgress = false;
      }))
      .subscribe(
        data => {
          this.userData = data;
          this.users[counter] = data;

        },
        error => {
          this.disableButtons = false;//????????????????????????????????????????????????????????

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
    this.UserServices.ActivateUser(parseInt(this.managerData.UserId), managerEnabled).pipe(finalize(
      () => {
        this.disableCheckButton = false;
        this.managerProgress = false;
        this.btmNavMessageService.changeMessage(false);
      }))
      .subscribe(
        data => {
          this.managerData = data;
          this.managers[this.managerCounter] = data;

        },
        error => {

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
          //this.managerData = data;
          this.users.splice[this.usercounter]
          // this.disableButtons = false;
          //this.managerProgress=false;
        },
        error => {
          //this.managerProgress=false;
          //this.disableButtons = false;
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
    //this.selectedRadio = value;

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
    //this.selectedRadio = value;

  }
}
