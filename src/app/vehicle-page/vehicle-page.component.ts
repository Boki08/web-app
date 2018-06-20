import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VehicleCardsComponent } from '../vehicle-cards/vehicle-cards.component';
import { Services } from '../services/services.component';
import { RentServices } from '../models/rentServices';
import { DataService } from '../cards/dataRentService';
@Component({
  selector: 'app-vehicle-page',
  templateUrl: './vehicle-page.component.html',
  styleUrls: ['./vehicle-page.component.css']
})
export class VehiclePageComponent implements OnInit {

  @ViewChild('vehicleCards') child: VehicleCardsComponent;
  Id: string = "-1";
  vehicles: any;
  counter: number;
  rentServiceTemp:RentServices;
  rentService:RentServices;
  constructor(private dataRentService: DataService,private Service: Services, private router: Router, private activatedRoute: ActivatedRoute) {
    activatedRoute.params.subscribe(params => { this.Id = params["rentServiceId"] });
  }
  /*  constructor(private Service: Services, private _routeParams: ActivatedRoute) {
     var queryParam = this._routeParams.get('q');
  } */
  id: number;

  ngOnInit() {
    this.dataRentService.currentMessage.subscribe(rentService => this.rentServiceTemp = rentService)
    this.rentService=this.rentServiceTemp;
    /* this.sub = this.activatedRoute.params.subscribe(params => {
      this.id = +params['rentServiceId'];
    }); */

    for (let i=0;i<this.counter;i++) {
      this.child.toggle(i);
    }

    this.counter = 0;
    this.Service.getRentServiceCars(parseInt(this.Id)).subscribe(
      data => {
        this.vehicles = data;

        for (let item of this.vehicles) {
          this.child.vehicles[this.counter] = item;
          this.child.toggle(this.counter++);
        }

      },
      error => {
        console.log(error);
      })
  }

}
