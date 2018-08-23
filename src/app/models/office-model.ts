export class OfficeModel{
    constructor(
        public OfficeId: number,
        public RentServiceId: number,
        public Address: string,
        public Latitude: DoubleRange,
        public Longitude: DoubleRange,
        public Picture:string,
    ){ }
}

