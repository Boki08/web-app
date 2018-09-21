import { Component, OnInit } from '@angular/core';
import { RentServices } from '../services/rent-service';
import { btmNavDataService } from '../bottom-navbar/btmNavDataService';
import { ServiceData } from '../models/serviceData';
import { finalize } from 'rxjs/operators'
import { ToasterService } from '../toaster-service/toaster-service.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-manage-services',
  templateUrl: './manage-services.component.html',
  styleUrls: ['./manage-services.component.css']
})
export class ManageServicesComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer,private toasterService:ToasterService,private btmNavMessageService: btmNavDataService, private RentServices: RentServices) { }

  tableVisible: boolean = false;
  showProgress: boolean = false;
  approved: boolean = false;
  notApproved: boolean = false;
  edited: boolean = false;
  notEdited: boolean = false;
  checkBoxDisabled: boolean = false;
  showProgressActivate: boolean = false;
  showProgressPicture: boolean = false;
  showServiceWarning: boolean = false;


  selectedSortTemp: string = "No Sort";
  selectedSort: string = "noSort";
  img: SafeUrl = "/assets/images/default-placeholder.png";
  rentServiceETag:string;


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
    this.btmNavMessageService.changeMessage(true);
    this.RentServices.GetAllServicesAdmin(this.approved, this.notApproved, this.edited, this.notEdited, this.selectedSort, this.pageIndex, this.pageSize) .pipe(finalize(
      () => {
        this.btmNavMessageService.changeMessage(false);
      }))
    .subscribe(
      data => {
        this.rentServices = data.body;

          let jsonData = JSON.parse(data.headers.get('Paging-Headers'));

          this.pageIndex = jsonData.currentPage;
          this.pageSize = jsonData.pageSize;
          this.totalPagesNumber = jsonData.totalPages;
          this.tableVisible = true;
          this.showServiceWarning=false;
  
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
    this.img  = "/assets/images/default-placeholder.png";
    this.selectedService = service;


    this.showProgressPicture = true;
    this.checkBoxDisabled = true;

    this.RentServices.GetRentService(this.selectedService.RentServiceId).pipe(finalize(
      () => {

      }))
      .subscribe(
        data => {

          this.selectedService =data.body;
          this.rentServiceETag = JSON.parse(data.headers.get('ETag'));


          this.RentServices.getImage(this.selectedService.Logo).pipe(finalize(
            () => {
              this.checkBoxDisabled = false;
              this.showProgressPicture = false;
            }))
            .subscribe(
              data => {
                this.createImageFromBlob(data);
              },
              error => {
                this.toasterService.Error(error.error.Message, 'Error');
              })
        },
        error => {
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
  setCheckBoxService(event) {
    this.showProgressActivate = true;
    this.checkBoxDisabled = true;
    let serviceActivated: boolean;
    if (event.target.checked) {
      serviceActivated = true;
    }
    else {
      serviceActivated = false;
    }


    this.RentServices.ActivateRentService(this.selectedService.RentServiceId, serviceActivated,this.rentServiceETag) .pipe(finalize(
      () => {
        this.checkBoxDisabled=false
        this.showProgressActivate = false;
      }))
    .subscribe(
      data => {
      
        this.rentServiceETag = JSON.parse(data.headers.get('ETag'));
        this.selectedService.Activated=serviceActivated;
        this.toasterService.Info(data.body,'Info');
        
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
      }
    )
  }
}
