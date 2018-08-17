import { BrowserModule } from '@angular/platform-browser';
import { NgModule,ViewChild } from '@angular/core';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { HttpClientXsrfModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Http, Response } from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

//import { OwlModule } from 'ngx-owl-carousel';

import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LogInComponent } from './log-in/log-in.component';
//import { Services } from './services/services.component';
import { TokenInterceptor } from './interceptors/interceptors.component';
import { AdminManagerGuard } from './guard/guard.component';
import { CommunicationComponent } from './communication/communication.component';
import { SearchComponent } from './search/search.component';
import { CardsComponent } from './cards/cards.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { RentServicesComponent } from './rent-services/rent-services.component';
import { VehiclePageComponent } from './vehicle-page/vehicle-page.component';
import { VehicleCardsComponent } from './vehicle-cards/vehicle-cards.component';
import { DataService } from './cards/dataRentService';
import { PagerComponent } from './pager/pager.component';
import { Services } from './services/services.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManageServicesComponent } from './manage-services/manage-services.component';


const Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch:"full"
  },
  {
    path: "login",
    component: LogInComponent
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "rentServices",
    component: RentServicesComponent
  },
  {
    path: "vehiclePage/:rentServiceId",
    component: VehiclePageComponent
  },
  {
    path: "editUser",
    component: EditProfileComponent,
    canActivate:['IsLoggedInGuard']
  },
  {
    path: "changePassword",
    component: ChangePasswordComponent,
    canActivate:['IsLoggedInGuard']
  },
  {
    path: "viewProfile",
    component: ViewProfileComponent,
    canActivate:['IsLoggedInGuard']
  }
]


@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
   // Services,
    //TokenInterceptor,
    //CanActivateViaAuthGuard,
    CommunicationComponent,
    SearchComponent,
    CardsComponent,
    NavbarComponent,
    HomeComponent,
    RegisterComponent,
    RentServicesComponent,
    VehiclePageComponent,
    
    VehicleCardsComponent,
    
    PagerComponent,
    
    EditProfileComponent,
    
    ChangePasswordComponent,
    
    ViewProfileComponent,
    
    ManageUsersComponent,
    
    ManageServicesComponent,
    
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(Routes),
    HttpClientModule,
    HttpClientXsrfModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot()
    //OwlModule,
    
  ],
 /*   entryComponents: [
    CardsComponent
  ],  */
  ///exports:[
   // Services
  //],
  providers:  [
    AdminManagerGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: 'CanAlwaysActivateGuard',
      useValue: () => {
        return true;
      } 
    },
    {
      provide:'IsLoggedInGuard',
      useValue: () => { if(localStorage.role !=undefined)
        return true;
      }
    },
    DataService
    ],
  bootstrap: [AppComponent],
 
})


export class AppModule {
  
  


}
