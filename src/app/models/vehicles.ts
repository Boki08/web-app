import { VehiclePictures } from "./vehicle-pictures";
import { VehicleTypes } from "./vehicleTypes";


export class Vehicle {
    constructor(  
        public VehicleId:number,
        public RentServiceId:number,
        public Model :string,
        public YearOfManufacturing : number,
        public Manufacturer : string,
        public Description :string,
        public HourlyPrice :number,
        public TypeId :number,
        public Available :boolean,
        public Enabled:boolean,
        public TypeOfVehicle: VehicleTypes,
    public VehiclePictures:VehiclePictures[],) {
      
    }
}