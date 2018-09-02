import { Component, OnInit } from '@angular/core';
import { OrderServices } from '../services/order-services';
import { OrderData } from '../models/orderData';
import { OfficeModel } from '../models/office-model';
import { OfficeServices } from '../services/office-services';
import { CommentServices } from '../services/comment-services';
import { CommentModel } from '../models/commentData';
import { Vehicle } from '../models/vehicles';
import { btmNavDataService } from '../bottom-navbar/btmNavDataService';

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.css']
})
export class ViewOrdersComponent implements OnInit {

  constructor(private btmNavMessageService: btmNavDataService,private commentServices: CommentServices, private orderServices: OrderServices, private officeServices: OfficeServices) { }

  pageSize: number = 9;
  pageIndex: number = 1;
  totalPagesNumber: number=0;
  orders: OrderData[];
  departureOffice: OfficeModel;
  returnOffice: OfficeModel;
  order: OrderData;
  canComment: boolean = false;
  comment: string;
  commentModel: CommentModel;
  displayComment: boolean = false;
  selectedGrade: string = "Grade";
  btnDisabled: boolean = true;
  vehicleReturned:boolean=true;
  showProgress:boolean=false;
  stopNav: number = 0;
  stopNavLockCount: number = 1;
  showOrderProgress:boolean=false;
  
  ngOnInit() {    
    this.btmNavMessageService.currentMessage.subscribe(message => this.showProgress = message)
    this.getAlllOrders();
  }
  ngOnDestroy() {
    this.btmNavMessageService.changeMessage(false);
  }
  public getAlllOrders() {
    this.btmNavMessageService.changeMessage(true);
    this.orderServices.GetAllUserOrders(this.pageIndex, this.pageSize).subscribe(
      data => {
        this.orders = data.body as OrderData[];
        //this.userData=this.users[0];

        let jsonData = JSON.parse(data.headers.get('Paging-Headers'));

        this.pageIndex = jsonData.currentPage;
        this.pageSize = jsonData.pageSize;
        this.totalPagesNumber = jsonData.totalPages;
        this.btmNavMessageService.changeMessage(false);
      },
      error => {
        this.btmNavMessageService.changeMessage(false);
        console.log(error.Message);
      })

    //this.RentServices = JSON.parse(temp);


    //(<ProcessComponent>componentRef.instance).data=step.desc;

  }
  OrderDetails(order: OrderData, i: number) {
    this.stopNavLockCount=1;
    this.displayComment = false;
    this.canComment = false
    this.order = order;
    this.vehicleReturned= this.order.VehicleReturned;
    this.showOrderProgress=true;
    this.officeServices.GetOffice(order.DepartureOfficeId).subscribe(
      data => {
        this.StopNav();
        this.departureOffice = data.body as OfficeModel;
      },
      error => {
        this.StopNav();
        console.log(error);
      })

    this.officeServices.GetOffice(order.ReturnOfficeId).subscribe(
      data => {
        this.StopNav();
        this.returnOffice = data.body as OfficeModel;

      },
      error => {
        this.StopNav();
        console.log(error);
      })

    let today = new Date();
    today.setMilliseconds(0);
    today.setSeconds(0);
    today.setMinutes(0);
    today.setHours(0);
    let returnDate = new Date(order.ReturnDate);
    returnDate.setMilliseconds(0);
    returnDate.setSeconds(0);
    returnDate.setMinutes(0);
    returnDate.setHours(0);

    if (returnDate <= today) {
      this.stopNavLockCount+=1;
      this.commentServices.CanComment(order.OrderId, order.UserId).subscribe(
        data => {
          let infoString = data.body as string;
          if (infoString == "canComment") {
            this.canComment = true;
          }
          else if (infoString == "commentExists") {
            this.canComment = false;
            this.commentServices.GetComment(order.OrderId, order.UserId).subscribe(
              data => {
                this.commentModel = data.body as CommentModel;
                this.displayComment = true;
              },
              error => {

                console.log(error);
              })
          }
          else{
            this.canComment = false;
            this.displayComment = false;
          }
          this.StopNav();
        },
        error => {
           this.StopNav();
          console.log(error);
        })

    }
    


  }

  onSubmit(comment: CommentModel) {
    comment.Grade = Number(this.selectedGrade);
    comment.OrderId = this.order.OrderId;
    this.commentServices.PostComment(comment).subscribe(
      data => {
        this.commentModel = data.body as CommentModel;
        this.displayComment = true;
        this.canComment = false;

      },
      error => {

        console.log(error);
      })
  }
  GetSelectedGrade(grade: string) {
    this.selectedGrade = grade;
    this.btnDisabled = false;
  }
  returnVehicle() {
    this.orderServices.ReturnVehicle(this.order.OrderId).subscribe(
      data => {
        this.order.Vehicle = data.body as Vehicle;
      },
      error => {

        console.log(error);
      })
  }  
  set page(val: number) {
    if (val !== this.pageIndex) {
      this.pageIndex = val;
      this.getAlllOrders();
    }
  }

  StopNav(){
    if (this.stopNav == this.stopNavLockCount) {
      this.showOrderProgress=false;
  
    }
    else {
      this.stopNav += 1;
    }
  }

  
}
