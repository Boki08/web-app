/* export class OfficeModel{
    constructor(
        public OfficeId: number,
        public RentServiceId: number,
        public Address: string,
        public Latitude: number,
        public Longitude: number,
        public Picture:string,
    ){ }
} */


export class OfficeModel {
     OfficeId: number
         RentServiceId: number
         Address: string
         Latitude: number
         Longitude: number
         Picture:string

    constructor(OfficeId:number,RentServiceId:number, Address: string,Latitude:number, Longitude: number,Picture:string) {
        this.OfficeId=OfficeId
        this.RentServiceId=RentServiceId
        this.Address=Address
        this.Latitude=Latitude
        this.Longitude=Longitude
        this.Picture=Picture
    }
}