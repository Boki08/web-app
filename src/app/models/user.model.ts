export class User {
    /* Id:number;
    FullName:string;
    Email:string;
    BirthDay:Date;
    PersonalDocument:string;
    Activated:boolean; */


    constructor(
        public UserId: string,
        public FullName: string,
        public Email: string,
        public BirthDate: Date,
        public Password: string,
        public RepeatedPassword: string,
        public DocumentPicture:string,
        public Activated:boolean,
    ){ }

}
