import { Component, OnInit, Input } from '@angular/core';
import { Services } from '../services/services.component';
import { RentServices } from '../models/rentServices';
import { ProcessComponent } from '../rent-services/process';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css'],
  providers: [Services],
})
export class CardsComponent implements OnInit,ProcessComponent {

  @Input() data:any;
  rentServices:any;
  constructor(private Service: Services) {

   }

  ngOnInit() {
    
/* let temp:any;
this.Service.getRentServiceInfo().subscribe(
  data => {
    this.rentServices = data;
    //alert("GET: id: " + this.methodResult.id + ", userId: " + this.methodResult.userId + ", title: " + this.methodResult.title + ", body: " + this.methodResult.body);
  },
  error => {
    console.log(error);
  })
    //this.RentServices = JSON.parse(temp); */
   
}

  

}
