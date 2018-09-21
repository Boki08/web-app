import { Component, ElementRef, Input, ViewChild, ChangeDetectorRef } from '@angular/core';

import { btmNavDataService } from './bottom-navbar/btmNavDataService';
import { Router, NavigationStart } from '@angular/router';





@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = 'app';

  loading: boolean = true;
  showRouter: boolean = false;
  locationChanged: boolean = false;
  element = document.getElementById("splash");
  @ViewChild('splash') splash: ElementRef;
  constructor(private cdRef: ChangeDetectorRef, private router: Router, private btmNavMessageService: btmNavDataService) {


  }
 

  ngAfterViewInit() {
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.locationChanged = true;
          this.showRouter = false;
          this.cdRef.detectChanges();
        }

      });
  }
  public ngOnInit(): void {
    this.loading = false;
    this.btmNavMessageService.currentMessage.subscribe(message => this.change = message)

  }
  set change(val: boolean) {
    if (val !== this.loading && this.locationChanged) {

      this.loading = val;

      if (this.loading == true) {
        this.splash.nativeElement.className = 'preloader splash';

      }
      else {
        this.splash.nativeElement.className = 'preloader splash splash--loaded';
        this.locationChanged = false;
        this.showRouter = true;
      this.cdRef.detectChanges();
        setTimeout(
          () => {

            this.splash.nativeElement.className = 'preloader splash splash--go_back';
           
          },
          500
        );
      }
    }
  }
}

