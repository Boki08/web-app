export class RentServices {
    rentServiceId:number
     name :string
     email  :string 
     logo  :string 
     description  :string 
     grade :number 

    constructor(rentServiceId:number,name:string, email: string,logo:string, description: string,grade:number) {
        this.rentServiceId=rentServiceId;
        this.name = name;
        this.email = email;
        this.logo = logo;
        this.description = description;
        this.grade = grade;
    }
}
