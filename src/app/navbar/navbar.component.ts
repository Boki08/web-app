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
      
      this.pageName="Admin Services";
    }
    else  if (localStorage.jwt && localStorage.role == "Manager") {
      this.link1 = "Add Rent Service";
      this.link2 = "Manage Rent Services";
      this.route1 = "/addServiceComponent";
      this.route2 = "/editServicesComponent";

      this.pageName="Manager Services";
    }
    else  if (localStorage.jwt && localStorage.role == "AppUser") {
      this.link1 = "Home";
      this.link2 = "Rent Services";
      this.link3 = "Orders";
      this.route1 = "/home";
      this.route2 = "/rentServices";
      this.route3 = "/viewOrdersComponent";

      this.pageName="User Services";
    }
    else {
      this.link1 = "Home";
      this.link2 = "Rent Services";
      this.route1 = "/home";
      this.route2 = "/rentServices";

      this.pageName="Visitor Services";
    }
  }


}
