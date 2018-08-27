import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VehicleServices } from '../services/vehicle-services';
import { Vehicle } from '../models/vehicles';
import { OfficeServices } from '../services/office-services';
import { OfficeModel } from '../models/office-model';

@Component({
  selector: 'app-rent-vehicle',
  templateUrl: './rent-vehicle.component.html',
  styleUrls: ['./rent-vehicle.component.css']
})
export class RentVehicleComponent implements OnInit {

  constructor(private officeServices: OfficeServices, private vehicleServices: VehicleServices, private activatedRoute: ActivatedRoute) {
    activatedRoute.params.subscribe(params => { this.vehicleID = params["vehicleId"] });
    activatedRoute.params.subscribe(params => { this.rentServiceId = params["rentServiceId"] });
  }

  vehicleID: number;
  vehicle: Vehicle;
  offices: OfficeModel[];
  rentServiceId:number;
  selectedDepartureOffice:string="Departure Office";
  officeId:number;

  ngOnInit() {
    this.vehicleServices.getVehicleInfo(this.vehicleID)
      .subscribe(
        data => {
          this.vehicle = data.body as Vehicle;
        },
        error => {
          alert(error.error.ModelState[""][0]);

        }
      );

    this.officeServices.GetAllRentOffices(this.rentServiceId)
      .subscribe(
        data => {
          this.offices = data.body as OfficeModel[];
        },
        error => {
          alert(error.error.ModelState[""][0]);

        }
      );
  }
  GetSelectedDepartureOffice(office:OfficeModel) {
   this.selectedDepartureOffice=office.Address;
   this.officeId=office.OfficeId;
  }

}
