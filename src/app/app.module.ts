import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ViewChild } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientXsrfModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Http, Response } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { DlDateTimePickerDateModule } from 'angular-bootstrap-datetimepicker';

//import { OwlModule } from 'ngx-owl-carousel';

import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LogInComponent } from './log-in/log-in.component';
//import { Services } from './services/services.component';
import { TokenInterceptor } from './interceptors/interceptors.component';
import { AdminManagerGuard } from './guard/guard.component';
import { CommunicationComponent } from './communication/communication.component';
import { SearchComponent } from './search/search.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { RentServicesComponent } from './rent-services/rent-services.component';
import { VehiclePageComponent } from './vehicle-page/vehicle-page.component';

import { PagerComponent } from './pager/pager.component';
import { Services } from './services/services.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManageServicesComponent } from './manage-services/manage-services.component';
import { AddServiceComponent } from './add-service/add-service.component';
import { EditServicesComponent } from './edit-services/edit-services.component';
import { ManageOfficesVehiclesComponent } from './manage-offices-vehicles/manage-offices-vehicles.component';
import { AddOfficeComponent } from './add-office/add-office.component';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
import { RentVehicleComponent } from './rent-vehicle/rent-vehicle.component';
import { ViewOrdersComponent } from './view-orders/view-orders.component';
import { BottomNavbarComponent } from './bottom-navbar/bottom-navbar.component';
import { btmNavDataService } from './bottom-navbar/btmNavDataService';
import { VehicleTypeComponent } from './vehicle-type/vehicle-type.component';
import { AdminOfficesVehiclesComponent } from './admin-offices-vehicles/admin-offices-vehicles.component';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { GetNotificationComponent } from './get-notification/get-notification.component';
import { ToasterService } from './toaster-service/toaster-service.component';
import { EditOfficeComponent } from './edit-office/edit-office.component';
import { EditVehicleComponent } from './edit-vehicle/edit-vehicle.component';

const Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
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
    canActivate: ['IsLoggedInGuard']
  },
  {
    path: "changePassword",
    component: ChangePasswordComponent,
    canActivate: ['IsLoggedInGuard']
  },
  {
    path: "viewProfile",
    component: ViewProfileComponent,
    canActivate: ['IsLoggedInGuard']
  }
  ,
  {
    path: "manageUsers",
    component: ManageUsersComponent,
    canActivate: ['IsAdminGuard']
  }
  ,
  {
    path: "manageServices",
    component: ManageServicesComponent,
    canActivate: ['IsAdminGuard']
  }
  ,
  {
    path: "addServiceComponent",
    component: AddServiceComponent,
    canActivate: ['IsManagerGuard']
  }
  ,
  {
    path: "editServicesComponent",
    component: EditServicesComponent,
    canActivate: ['IsManagerGuard']
  } ,
  {
    path: "manageOfficesVehiclesComponent/:rentServiceId",
    component: ManageOfficesVehiclesComponent,
    canActivate: ['IsManagerGuard']
  },
  {
    path: "addOfficeComponent/:rentServiceId",
    component: AddOfficeComponent,
    canActivate: ['IsManagerGuard']
  }
  ,
  {
    path: "addVehicleComponent/:rentServiceId",
    component: AddVehicleComponent,
    canActivate: ['IsManagerGuard']
  },
  {
    path: "rentVehicleComponent/:rentServiceId/:vehicleId",
    component: RentVehicleComponent,
    canActivate: ['IsUserGuard']
  }
  ,
  {
    path: "viewOrdersComponent",
    component: ViewOrdersComponent,
    canActivate: ['IsUserGuard']
  }
  ,
  {
    path: "vehicleType",
    component: VehicleTypeComponent,
    canActivate: ['IsAdminGuard']
  }
  ,
  {
    path: "AdminOfficesVehicles/:rentServiceId",
    component: AdminOfficesVehiclesComponent,
    canActivate: ['IsAdminGuard']
  }
  ,
  {
    path: "editOfficeComponent/:officeId",
    component: EditOfficeComponent,
    canActivate: ['IsManagerGuard']
  }
  ,
  {
    path: "editVehicleComponent/:vehicleId",
    component: EditVehicleComponent,
    canActivate: ['IsManagerGuard']
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

    NavbarComponent,
    HomeComponent,
    RegisterComponent,
    RentServicesComponent,
    VehiclePageComponent,

    PagerComponent,

    EditProfileComponent,

    ChangePasswordComponent,

    ViewProfileComponent,

    ManageUsersComponent,

    ManageServicesComponent,

    AddServiceComponent,

    EditServicesComponent,

    ManageOfficesVehiclesComponent,

    AddOfficeComponent,

    AddVehicleComponent,

    RentVehicleComponent,

    ViewOrdersComponent,

    BottomNavbarComponent,

    VehicleTypeComponent,

    AdminOfficesVehiclesComponent,

    GetNotificationComponent,

    EditOfficeComponent,

    EditVehicleComponent,

    

  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(Routes),
    HttpClientModule,
    HttpClientXsrfModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(), 
    BrowserModule,
    AgmCoreModule.forRoot({apiKey: 'AIzaSyDnihJyw_34z5S1KZXp90pfTGAqhFszNJk'}),
    DlDateTimePickerDateModule,
    BsDatepickerModule.forRoot(),
  
    //OwlModule,

  ],
  /*   entryComponents: [
     CardsComponent
   ],  */
  ///exports:[
  // Services
  //],
  providers: [
   
    AdminManagerGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: 'AdminManagerGuard',
      useValue: () => {
        return true;
      }
    },
    {
      provide: 'IsLoggedInGuard',
      useValue: () => {
        if (localStorage.role != undefined)
          return true;
      }
    },
    {
      provide: 'IsAdminGuard',
      useValue: () => {
        if (localStorage.role == "Admin")
          return true;
      }
    },
    {
      provide: 'IsUserGuard',
      useValue: () => {
        if (localStorage.role == "AppUser")
          return true;
      }
    }
    ,
    {
      provide: 'IsManagerGuard',
      useValue: () => {
        if (localStorage.role == "Manager")
          return true;
      }
    },
    btmNavDataService,
    ToasterService
  ],
  bootstrap: [AppComponent],

})


export class AppModule {




}
