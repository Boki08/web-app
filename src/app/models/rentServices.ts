export class RentServices {
     name :string
     email  :string 
     logo  :string 
     description  :string 
     grade :number 

    constructor(name:string, email: string,logo:string, description: string,grade:number) {
        this.name = name;
        this.email = email;
        this.logo = logo;
        this.description = description;
        this.grade = grade;
    }
}
