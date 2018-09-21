import { Component, OnInit, ViewChild, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { ProcessItem } from './process-item';
import { ProcessComponent } from './process';
import { Services } from '../services/services.component';
import { btmNavDataService } from '../bottom-navbar/btmNavDataService';
import { finalize } from 'rxjs/operators'
import { ToasterService } from '../toaster-service/toaster-service.component';



@Component({
  selector: 'app-rent-services',
  templateUrl: './rent-services.component.html',
  styleUrls: ['./rent-services.component.css'],
})
export class RentServicesComponent implements OnInit {

  rentServices: any;
  vehicles: any;
  counter: number;
  pageIndex: number = 1;
  pageSize: number = 9;
  totalPagesNumber: number = 0;
  cardsVisible: boolean = false;
  showProgress: boolean = true;
  showServiceWarning: boolean = false;
option:number=1;

  @ViewChild('processContainer', { read: ViewContainerRef }) container;
  constructor(private toasterService:ToasterService,private btmNavMessageService: btmNavDataService, private resolver: ComponentFactoryResolver/* ,private PagerService: PagerServices */, private Service: Services) {
    this.counter = 0;
  }

  set page(val: number) {
    if (val !== this.pageIndex) {
      this.pageIndex = val;
      this.getRentServices();
    }
  }

  ngOnInit() {
    this.btmNavMessageService.currentMessage.subscribe(message => this.showProgress = message)
    
    this.getRentServices();

  }
  ngOnDestroy() {
    this.btmNavMessageService.changeMessage(false);
  }
  public getRentServices() {
    this.btmNavMessageService.changeMessage(true);
    this.Service.GetRentServices(this.pageIndex, this.pageSize,this.option) .pipe(finalize(
      () => {
        this.btmNavMessageService.changeMessage(false);
      }))
    .subscribe(
      data => {

        this.rentServices = data.body;
        this.cardsVisible = true;
        let jsonData = JSON.parse(data.headers.get('Paging-Headers'));

        this.pageIndex = jsonData.currentPage;
        this.pageSize = jsonData.pageSize;
        this.totalPagesNumber = jsonData.totalPages;

        this.showServiceWarning=false;
         },
      error => {
        if(error.error.Message==='There are no Rent Services'){
          this.toasterService.Warning(error.error.Message, 'Warning');
          this.showServiceWarning=true;
        }
        else{
          this.showServiceWarning=false;
          this.toasterService.Error(error.error.Message, 'Error');
        }
        this.cardsVisible = true;
        console.log(error);
      })
  }
 
  setRadio($event) {
    if ('noSorting' == $event.target.value) {
      this.option = 1;
    }
    else if ('bestGades' == $event.target.value) {
      this.option = 2;
    }
    else if ('mostVehicles' == $event.target.value) {
      this.option = 3;
    }
    else {//mostOrders
      this.option = 4;
    }
    this.getRentServices();
  }
}