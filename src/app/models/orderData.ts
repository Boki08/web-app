import { Vehicle } from "./vehicles";
import { User } from "./user.model";

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
        public User:User,
        public VehicleReturned:boolean,
    ){ }
}


