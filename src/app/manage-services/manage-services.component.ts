import { Component, OnInit } from '@angular/core';
import { RentServices } from '../services/rent-service';
import { btmNavDataService } from '../bottom-navbar/btmNavDataService';
import { ServiceData } from '../models/serviceData';
import { finalize } from 'rxjs/operators'
import { ToasterService } from '../toaster-service/toaster-service.component';

@Component({
  selector: 'app-manage-services',
  templateUrl: './manage-services.component.html',
  styleUrls: ['./manage-services.component.css']
})
export class ManageServicesComponent implements OnInit {

  constructor(private toasterService:ToasterService,private btmNavMessageService: btmNavDataService, private RentServices: RentServices) { }

  tableVisible: boolean = false;
  showProgress: boolean = false;
  approved: boolean = false;
  notApproved: boolean = false;
  edited: boolean = false;
  notEdited: boolean = false;
  checkBoxDisabled: boolean = true;
  showServiceProgress: boolean = false;
  showServiceWarning: boolean = false;


  selectedSortTemp: string = "No Sort";
  selectedSort: string = "noSort";


  pageSize: number = 10;
  pageIndex: number = 1;
  totalPagesNumber: number = 0;

  selectedService: ServiceData=null;

  rentServices: ServiceData[];

  ngOnInit() {
    this.GetRentServices();
  }
  ngOnDestroy() {
    this.btmNavMessageService.changeMessage(false);
  }
  GetRentServices() {
    this.btmNavMessageService.currentMessage.subscribe(message => this.showProgress = message)
    //this.dataService.currentMessage.subscribe(rentService => this.rentServiceTemp = rentService)
    this.btmNavMessageService.changeMessage(true);
    this.RentServices.GetAllServicesAdmin(this.approved, this.notApproved, this.edited, this.notEdited, this.selectedSort, this.pageIndex, this.pageSize) .pipe(finalize(
      () => {
        this.btmNavMessageService.changeMessage(false);
      }))
    .subscribe(
      data => {
        this.rentServices = data.body;
        /* if (this.rentServices.length > 0) { */

          let jsonData = JSON.parse(data.headers.get('Paging-Headers'));

          this.pageIndex = jsonData.currentPage;
          this.pageSize = jsonData.pageSize;
          this.totalPagesNumber = jsonData.totalPages;
          this.tableVisible = true;
          this.showServiceWarning=false;
      /*   }
        else {
          this.tableVisible = false;
        } */

        
      },
      error => {
        if(error.error.Message==="There are no Rent Services"){
          this.toasterService.Warning(error.error.Message,'Warning');
          this.showServiceWarning=true;
        }
        else{
          this.showServiceWarning=false;
          this.toasterService.Error(error.error.Message,'Error');
        }
        this.tableVisible = false;
    
        console.log(error);
      })
  }
  set page(val: number) {
    if (val !== this.pageIndex) {
      this.pageIndex = val;
      this.GetRentServices();
    }
  }
  setCheckBox1(event) {
    if (event.target.checked) {
      this.approved = true;
    }
    else {
      this.approved = false;
    }
    this.GetRentServices();
  }
  setCheckBox2(event) {
    if (event.target.checked) {
      this.notApproved = true;
    }
    else {
      this.notApproved = false;
    }
    this.GetRentServices();
  }
  setCheckBox3(event) {
    if (event.target.checked) {
      this.edited = true;
    }
    else {
      this.edited = false;
    }
    this.GetRentServices();
  }
  setCheckBox4(event) {
    if (event.target.checked) {
      this.notEdited = true;
    }
    else {
      this.notEdited = false;
    }
    this.GetRentServices();
  }
  GetSelectedType(type: string) {
    if (type == "approvedFirst") {
      this.selectedSortTemp = "Approved First";
      this.selectedSort = 'approvedFirst';
    }
    else if (type == "notApprovedFirst") {
      this.selectedSortTemp = "Unapproved First";
      this.selectedSort = 'notApprovedFirst';
    }
    else if (type == "editedFirst") {
      this.selectedSortTemp = "Edited First";
      this.selectedSort = 'editedFirst';
    }
    else if (type == "notEditedFirst") {
      this.selectedSortTemp = "Not Edited First";
      this.selectedSort = 'notEditedFirst';
    }
    else {
      this.selectedSortTemp = "No Sorting";
      this.selectedSort = 'Mixed';
    }
    this.GetRentServices();
  }

  serviceDetails(service: ServiceData, counter: number) {
    this.selectedService = service;
  }

  setCheckBoxService(event) {
    this.showServiceProgress = true;
    this.checkBoxDisabled = true;
    let serviceActivated: boolean;
    if (event.target.checked) {
      serviceActivated = true;
    }
    else {
      serviceActivated = false;
    }


    this.RentServices.ActivateRentService(this.selectedService.RentServiceId, serviceActivated) .pipe(finalize(
      () => {
        this.checkBoxDisabled=false
        this.showServiceProgress = false;
      }))
    .subscribe(
      data => {
      
        this.selectedService.Activated=serviceActivated;
        this.toasterService.Info(data.body,'Info');
        
      },
      error => {
        this.toasterService.Error(error.error.Message,'Error');
        //alert(error.error.Message);
      }
    )
  }
}
