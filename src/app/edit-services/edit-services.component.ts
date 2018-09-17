import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RentServices } from '../services/rent-service';
import { ServiceData } from '../models/serviceData';
import { btmNavDataService } from '../bottom-navbar/btmNavDataService';
import { finalize } from 'rxjs/operators'
import { ToasterService } from '../toaster-service/toaster-service.component';


@Component({
  selector: 'app-edit-services',
  templateUrl: './edit-services.component.html',
  styleUrls: ['./edit-services.component.css']
})
export class EditServicesComponent implements OnInit {

  constructor(private toasterService:ToasterService,private btmNavMessageService: btmNavDataService, private RentService: RentServices) { }

  @ViewChild('defaultUnchecked') checkBox1: ElementRef;
  @ViewChild('defaultUnchecked2') checkBox2: ElementRef;
  pageSize: number = 12;
  pageIndex: number = 1;
  totalPagesNumber: number=0;
  private selectedLink: string = "Approved";
  noOffices: boolean = false;
  noVehicles: boolean = false;
  isApproved: boolean = true;
  rentServices: ServiceData[];
  counter: number;
  cardsVisible:boolean;
  showProgress: boolean = true;
  showRentServicesWarning:boolean=false;

  set page(val: number){
    if(val!== this.pageIndex) {
      this.pageIndex=val;
      this.getAllServices();
    }
  }

  ngOnInit() {
    this.btmNavMessageService.currentMessage.subscribe(message => this.showProgress = message)
    this.cardsVisible=false;
    this.getAllServices();
  }
  ngOnDestroy() {
    this.btmNavMessageService.changeMessage(false);
  }

  setradio(value: string): void {
    if (value == 'Approved') {
      this.noVehicles = false;
      this.noOffices = false;
      this.checkBox1.nativeElement.checked = false;
      this.checkBox2.nativeElement.checked = false;
      this.isApproved = true;
    }
    else {
      this.isApproved = false;
    }
    this.getAllServices();
    this.selectedLink = value;

  }

  getAllServices() {

    this.btmNavMessageService.changeMessage(true);
    this.RentService.GetAllServicesManager(this.isApproved, this.noOffices, this.noVehicles, this.pageIndex, this.pageSize) .pipe(finalize(
      () => {
        this.btmNavMessageService.changeMessage(false);
        
      }))
    .subscribe(
      data => {
        this.rentServices = data.body as ServiceData[];
        //this.userData=this.users[0];
        this.cardsVisible = true;
        
        let jsonData = JSON.parse(data.headers.get('Paging-Headers'));

        this.pageIndex = jsonData.currentPage;
        this.pageSize = jsonData.pageSize;
        this.totalPagesNumber = jsonData.totalPages;
        this.showRentServicesWarning=false;
      },
      error => {
      if(error.error.Message==='There are no Rent Services'){
        this.toasterService.Warning(error.error.Message,'Warning');
        this.showRentServicesWarning=true;
      }
      else{
        this.toasterService.Error(error.error.Message,'Error');
        this.showRentServicesWarning=false;
      }
      this.cardsVisible = false;
        console.log(error);
      })
  }
  setCheckBoxVehicle(event) {
    if (event.target.checked) {
      this.noVehicles = true;
    }
    else {
      this.noVehicles = false;
    }
    this.getAllServices();
  }
  setCheckBoxOffice(event) {
    if (event.target.checked) {
      this.noOffices = true;
    }
    else {
      this.noOffices = false;
    }
    this.getAllServices();
  }
}
