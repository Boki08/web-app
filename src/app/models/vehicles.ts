export class Vehicles {
    vehicleId:number
     model :string
     yearOfManufacturing  :string 
     manufacturer  :string 
     description  :string 
     available :boolean 

    constructor(vehicleId:number,model:string, yearOfManufacturing: string,manufacturer:string, description: string,available:boolean) {
        this.vehicleId=vehicleId;
        this.model = model;
        this.yearOfManufacturing = yearOfManufacturing;
        this.manufacturer = manufacturer;
        this.description = description;
        this.available = available;
    }
}