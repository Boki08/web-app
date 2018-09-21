import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() { }
  pageName:string;
  link1: string;
  link2: string;
  link3: string;
  route1: string;
  route2: string;
  route3: string;
  userNav: boolean;

  link1Visible: boolean=false;
  link2Visible: boolean=false;
  link3Visible: boolean=false;
  ngOnInit() {
    this.loggedOut();
  }
  loggedOut() {
    if (localStorage.jwt && localStorage.role == "Admin") {
      this.link1 = "Manage Users";
      this.link2 = "Manage Rent Services";
      this.link3 = "Vehicle Type";
      this.route1 = "/manageUsers";
      this.route2 = "/manageServices";
      this.route3 = "/vehicleType";

      this.link1Visible=true;
      this.link2Visible=true;
      this.link3Visible=true;
      
      this.pageName="Admin Services";
    }
    else  if (localStorage.jwt && localStorage.role == "Manager") {
      this.link1 = "Add Rent Service";
      this.link2 = "Manage Rent Services";
      this.route1 = "/addServiceComponent";
      this.route2 = "/editServicesComponent";

      this.link1Visible=true;
      this.link2Visible=true;
      this.link3Visible=false;
      

      this.pageName="Manager Services";
    }
    else  if (localStorage.jwt && localStorage.role == "AppUser") {

      this.link1 = "Rent Services";
      this.link2 = "Orders";

      this.route1 = "/rentServices";
      this.route2 = "/viewOrdersComponent";

      this.link1Visible=true;
      this.link2Visible=true;
      this.link3Visible=false;

      this.pageName="User Services";
    }
    else {

      this.link1 = "Rent Services";
      this.route1 = "/rentServices";

      this.link1Visible=true;
      this.link2Visible=false;
      this.link3Visible=false;

      this.pageName="Visitor Services";
    }
  }


}
