import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() { }
  link1: string;
  link2: string;
  route1: string;
  route2: string;
  userNav: boolean;
  ngOnInit() {
    this.loggedOut();
  }
  loggedOut() {
    if (localStorage.jwt && localStorage.role == "Admin") {
      this.link1 = "Manage Users";
      this.link2 = "Manage Rent Services";
      this.route1 = "/manageUsers";
      this.route2 = "/manageServices";
    }
    else  if (localStorage.jwt && localStorage.role == "Manager") {
      this.link1 = "Add Rent Service";
      this.link2 = "Manage Rent Services";
      this.route1 = "/addServiceComponent";
      this.route2 = "/editServicesComponent";
    }
    else {
      this.link1 = "Home";
      this.link2 = "Rent Services";
      this.route1 = "/home";
      this.route2 = "/rentServices";
    }
  }


}
