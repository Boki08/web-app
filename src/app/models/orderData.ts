import { Vehicle } from "./vehicles";

 export class OrderData{
    constructor(
        public OrderId:number,
        public DepartureDate: Date,
        public ReturnDate: Date,
        public Price: number,
        public VehicleId:number,
        public UserId:number,
        public DepartureOfficeId: number,
        public ReturnOfficeId:number,
        public Vehicle:Vehicle,
        public VehicleReturned:boolean,
    ){ }
}


