import { Component, ElementRef, Input, ViewChild } from '@angular/core';

import { btmNavDataService } from './bottom-navbar/btmNavDataService';
import { Router, NavigationStart } from '@angular/router';





@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = 'app';

  @Input() loading: boolean;
  locationChanged: boolean = false;
  element = document.getElementById("splash");
  @ViewChild('splash') splash: ElementRef;
  // I initialize the app-component.
  constructor(private router: Router, private btmNavMessageService: btmNavDataService) {
    this.loading = true;


  }

  ngAfterViewInit() {
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.locationChanged = true;
        }

      });
  }
  public ngOnInit(): void {
    this.btmNavMessageService.currentMessage.subscribe(message => this.change = message)


  }
  set change(val: boolean) {
    //debugger;
    if (val !== this.loading && this.locationChanged) {

      this.loading = val;

      if (this.loading == true) {
        this.splash.nativeElement.className = 'preloader splash';

      }
      else {

        this.splash.nativeElement.className = 'preloader splash splash--loaded';

        setTimeout(
          () => {

            this.splash.nativeElement.className = 'preloader splash splash--go_back';
            this.locationChanged=false;
          },
          500
        );
      }
    }
  }
}

