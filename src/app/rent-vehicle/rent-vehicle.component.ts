import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleServices } from '../services/vehicle-services';
import { Vehicle } from '../models/vehicles';
import { OfficeServices } from '../services/office-services';
import { OfficeModel } from '../models/office-model';
import { OrderServices } from '../services/order-services';
import { OrderData } from '../models/orderData';
import { NgForm } from '@angular/forms';
import { DlDateTimePickerModel } from 'angular-bootstrap-datetimepicker';
import { formatDate, DatePipe } from '@angular/common';
import { PlatformLocation } from '@angular/common';
import { btmNavDataService } from '../bottom-navbar/btmNavDataService';
import { finalize } from 'rxjs/operators'
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { enGbLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';
defineLocale('en-gb', enGbLocale);


@Component({
  selector: 'app-rent-vehicle',
  templateUrl: './rent-vehicle.component.html',
  styleUrls: ['./rent-vehicle.component.css']
})
export class RentVehicleComponent implements OnInit {

  constructor(private localeService: BsLocaleService,private btmNavMessageService: btmNavDataService, private router: Router, private orderServices: OrderServices, private officeServices: OfficeServices, private vehicleServices: VehicleServices, private activatedRoute: ActivatedRoute) {
    activatedRoute.params.subscribe(params => { this.vehicleID = params["vehicleId"] });
    activatedRoute.params.subscribe(params => { this.rentServiceId = params["rentServiceId"] });

    this.bsConfigDeparture = Object.assign({}, {
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false,
      dateInputFormat: 'DD.MM.YYYY.',
      minDate: new Date(),

    });

    this.bsConfigReturn = Object.assign({}, {
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false,
      dateInputFormat: 'DD.MM.YYYY.',
      minDate: new Date(),

    });
   
    this.localeService.use("en-gb");
  }
  
  bsConfigDeparture: Partial<BsDatepickerConfig>;
  bsConfigReturn: Partial<BsDatepickerConfig>;
  vehicleID: number;
  vehicle: Vehicle;
  offices: OfficeModel[];
  rentServiceId: number;
  departureDate: Date = null;
  returnDate: Date = null;
  btnDisabled: boolean = true;
  dangerErrMessage: string;
  showDangerErrorMessage: boolean = false;
  btnHidden: boolean = false;

  //officeId:number;
  @Input() office: OfficeModel = null;
  seeMap: boolean = false;

  departureOfficeId: number;
  departureOffice: OfficeModel;
  selectedDepartureOffice: string = "Departure Office";

  returnOfficeId: number;
  returnOffice: OfficeModel;
  selectedReturnOffice: string = "Return Office";

  
  isDepartureDateBad: boolean = false;
  isReturnDateBad: boolean = false;

  calcPrice: number;
  errMessage: string;
  //@Output() progressEvent = new EventEmitter<boolean>();
  firstLoad: boolean = false;
  showProgress: boolean = false;

  //minDate="1900-1-1";
  //minDate = new Date(1850, 0, 1);
  date = new Date();
  // [minDate]="{year: 2010, month: 1, day, 1}"
  minDate = this.date.getFullYear() + "-" + (this.date.getMonth() + 1) + "-" + this.date.getDate();

  ngOnInit() {
    this.btmNavMessageService.currentMessage.subscribe(message => this.showProgress = message)
    this.btmNavMessageService.changeMessage(true);

    this.vehicleServices.getVehicleInfo(this.vehicleID)
      .subscribe(
        data => {
          this.vehicle = data.body as Vehicle;
          if (this.vehicle.Available != true) {
            this.btnDisabled = true;

            this.dangerErrMessage = "This Vehicle is not Available!";
            this.showDangerErrorMessage = true;

          }
          if (this.firstLoad == true) {
            this.btmNavMessageService.changeMessage(false);
          }
          else {
            this.firstLoad = true;
          }

        },
        error => {
          if (this.firstLoad == true) {
            this.btmNavMessageService.changeMessage(false);
          }
          else {
            this.firstLoad = true;
          }
          alert(error.error.ModelState[""][0]);

        }
      );

    this.officeServices.GetAllRentOffices(this.rentServiceId)
      .subscribe(
        data => {
          this.offices = data.body as OfficeModel[];
          if (this.offices.length == 0) {
            this.btnDisabled = true;

            this.dangerErrMessage = "This Rent Service doesn't have any offices!";
            this.showDangerErrorMessage = true;
          }
          else {
            this.selectedDepartureOffice = data.body[0].Address;
            this.selectedReturnOffice = data.body[0].Address;
            this.departureOfficeId = data.body[0].OfficeId;
            this.returnOfficeId = data.body[0].OfficeId;
            //this.office=data.body[0];
            this.returnOffice = data.body[0];
            this.departureOffice = data.body[0];

            if (this.firstLoad == true) {
              
            }
            else {
              this.firstLoad = true;
            }
          }
          this.btmNavMessageService.changeMessage(false);
        },
        error => {
          if (this.firstLoad == true) {
            this.btmNavMessageService.changeMessage(false);
          }
          else {
            this.firstLoad = true;
          }
          alert(error.error.ModelState[""][0]);

        }
      );
  }
  ngOnDestroy() {
    this.btmNavMessageService.changeMessage(false);
  }
  GetSelectedDepartureOffice(office: OfficeModel) {
    this.selectedDepartureOffice = office.Address;
    this.departureOfficeId = office.OfficeId;
    this.departureOffice = office;

  }
  GetSelectedReturnOffice(office: OfficeModel) {
    this.selectedReturnOffice = office.Address;
    this.returnOfficeId = office.OfficeId;
    this.returnOffice = office;
  }

  returnDatePicked($event) {
    //let d=$event.year +""+$event.month +""+$event.day +""+"T00:00:00";
    // let d=$event
    // d.hour
   /*  let dd = new Date();
    dd.setMilliseconds(0);
    dd.setSeconds(0);
    dd.setMinutes(0);
    dd.setHours(2);

    dd.setFullYear($event.year, $event.month - 1, $event.day); */
    //formatDate(new Date(d), 'yyyy/MM/dd', 'en');
    // let myDate = this.datePipe.transform(new Date(d), 'yyyy-MM-dd');
    this.returnDate = $event;

    this.testReturnDate();
    this.testDepartureDate();

    let dateTemp=new Date(this.returnDate);
    dateTemp.setHours(dateTemp.getHours()-24);
    this.bsConfigDeparture = Object.assign({}, {
      maxDate:dateTemp,
      minDate: new Date(),
    });
  }
  testReturnDate() {
    let today = new Date();
     today.setMilliseconds(0);
    today.setSeconds(0);
    today.setMinutes(0);
    today.setHours(0); 

    if (this.returnDate != null) {
      if (this.returnDate <= today) {
        this.errMessage = "Return date can't be before tommorow";
        this.btnDisabled = true;
        this.isReturnDateBad = true;
      }
      else if (this.departureDate != null) {
        if (this.departureDate >= this.returnDate) {
          this.btnDisabled = true;
          this.isReturnDateBad = true;
          this.errMessage = "Return date can't be before the Departure date";
        }
        else {
          this.btnDisabled = false;
          this.isReturnDateBad = false;
          this.calcPrice = this.vehicle.HourlyPrice * (this.returnDate.getTime() - this.departureDate.getTime()) / 3600000;

        }

      
      }
      else {
        this.btnDisabled = true;
        this.isReturnDateBad = false;

        
      }
    } else {
      this.btnDisabled = true;
      this.isReturnDateBad = true;
      this.errMessage = "Pick Return date";
    }
  }

  departureDatePicked($event) {

   /*  let dd = new Date();
    dd.setMilliseconds(0);
    dd.setSeconds(0);
    dd.setMinutes(0);
    dd.setHours(2);

    dd.setFullYear($event.year, $event.month - 1, $event.day);
    //formatDate(new Date(d), 'yyyy/MM/dd', 'en');
    // let myDate = this.datePipe.transform(new Date(d), 'yyyy-MM-dd');
    this.departureDate = dd; */
    this.departureDate =$event;
    this.testDepartureDate();
    this.testReturnDate();

    let dateTemp=new Date(this.departureDate);
     dateTemp.setHours(dateTemp.getHours()+24);
    this.bsConfigReturn = Object.assign({}, {
      

      minDate:dateTemp,
    });

  }
  testDepartureDate() {
    let today = new Date();
    today.setMilliseconds(0);
    today.setSeconds(0);
    today.setMinutes(0);
    today.setHours(0); 

    if (this.departureDate != null) {

      if (this.departureDate < today) {
        this.errMessage = "Departure date can't be before today";
        this.btnDisabled = true;
        this.isDepartureDateBad = true;
      }
      else if (this.returnDate != null) {
        if (this.departureDate >= this.returnDate) {
          this.btnDisabled = true;
          this.isDepartureDateBad = true;
          this.errMessage = "Departure date can't be after the Return date";
        }
        else {
          this.btnDisabled = false;
          this.isDepartureDateBad = false;
          this.calcPrice = this.vehicle.HourlyPrice * (this.returnDate.getTime() - this.departureDate.getTime()) / 3600000;
        }
      }
      else {
        this.btnDisabled = true;
        this.isDepartureDateBad = false;
        this.errMessage = "Departure date can't be after the Return date";
      }
    } else {
      this.btnDisabled = true;
      this.isReturnDateBad = true;
      this.errMessage = "Pick Departure date";
    }

  }

  onSubmit(order: any, form: NgForm) {
    //console.log(this.args, this.user.Id); 
    this.btnHidden = true;
    order.DepartureDate = this.departureDate.toJSON();;
    order.ReturnDate = this.returnDate.toJSON();;
    order.VehicleId = this.vehicleID;
    order.DepartureOfficeId = this.departureOfficeId;
    order.ReturnOfficeId = this.returnOfficeId;
    this.orderServices.OrderVehicle(order)
      .subscribe(
        data => {
          alert("Success!");
          this.router.navigate(['/viewOrdersComponent']);
        },
        error => {
          this.btnHidden = false;
          alert(error.error.Message);
        })
  }
}
