import { Component, OnInit } from '@angular/core';
import { UserServices } from '../services/user-services';
import { User } from '../models/user.model';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {

  constructor(private UserServices: UserServices) { }

  pageSize: number = 5;
  pageIndex: number = 1;
  totalPagesNumber: number;
  users: User[];
  userData: User;
  disableButtons: boolean;
  counter: number;

  ngOnInit() {

    this.disableButtons = false;
    this.getAlllUsers("Manager");
  }
  public getAlllUsers(type:string) {
    this.UserServices.GetAllUsers(type,this.pageIndex, this.pageSize).subscribe(
      data => {
        this.users = data.body as User[];
        //this.userData=this.users[0];

        let jsonData = JSON.parse(data.headers.get('Paging-Headers'));

        this.pageIndex = jsonData.currentPage;
        this.pageSize = jsonData.pageSize;
        this.totalPagesNumber = jsonData.totalPages;
      },
      error => {
        console.log(error);
      })

    //this.RentServices = JSON.parse(temp);


    //(<ProcessComponent>componentRef.instance).data=step.desc;

  }

  set page(val: number) {
    if (val !== this.pageIndex) {

      this.pageIndex = val;
      this.getAlllUsers(this.selectedLink);
    }
  }

  private selectedLink: string = "Manager";
  
  setradio(value: string): void {
    this.getAlllUsers(value);
    this.selectedLink = value;

  }
  isSelected(name: string): boolean {

    if (this.selectedLink == name) {
      return true;
    }
    return false
  }

  userDetails(user: User, counter: number) {
    this.userData = user;
    this.counter = counter;
  }
  acceptUser(counter: number, userID: number, activate: boolean) {
    if (activate == true) {
      this.disableButtons = true;
    }
    this.UserServices.ActivateUser(userID, activate).subscribe(
      data => {
        this.userData = data;
        this.users[counter] = data;
      },
      error => {
        this.disableButtons = false;
        console.log(error);
      })
  }
}
