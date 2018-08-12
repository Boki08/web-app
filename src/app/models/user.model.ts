export class User {
    /* Id:number;
    FullName:string;
    Email:string;
    BirthDay:Date;
    PersonalDocument:string;
    Activated:boolean; */


    constructor(
        public fullName: string,
        public email: string,
        public birthDate: Date,
        public password: string,
        public repeatedPassword: string,
    ){ }

}
