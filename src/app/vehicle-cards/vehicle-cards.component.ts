import { Component, OnInit ,Input} from '@angular/core';

@Component({
  selector: 'app-vehicle-cards',
  templateUrl: './vehicle-cards.component.html',
  styleUrls: ['./vehicle-cards.component.css']
})
export class VehicleCardsComponent implements OnInit {

  @Input() isVisible: boolean[];

  @Input() data: any;
  @Input() vehicles: any[];
  constructor(/* private Service: Services */) {
    this.isVisible = [false, false, false, false, false, false];
    this.vehicles = [true, true, true, false, false, false];
  }
  ngOnInit() {
  }
  toggle(num: number): void {
    this.isVisible[num] = !this.isVisible[num];
  }
}
