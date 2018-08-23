export class Vehicle {
    constructor(  
        public VehicleId:number,
        public Model :string,
        public YearOfManufacturing : number,
        public Manufacturer : string,
        public Description :string,
        public Available :boolean,
        public Enabled:boolean,
        public VehiclePictures:string[],) {
      
    }
}