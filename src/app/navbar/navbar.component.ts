import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() { }
link1:string;
link2:string;
route1:string;
route2:string;
userNav:boolean;
  ngOnInit() {
    {
      if (localStorage.jwt && localStorage.role=="Admin") {
        this.link1="Manage Users";
        this.link2="Manage Rent Services";
        this.route1="/home";
        this.route2="/rentServices";
      }
      else{
        this.link1="Home";
        this.link2="Rent Services";
        this.route1="Home";
        this.route2="Rent Services";
      }
  
    }
  }

}
