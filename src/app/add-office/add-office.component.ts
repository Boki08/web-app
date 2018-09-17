import { Component, OnInit, ViewChild } from '@angular/core';
import { MapInfo } from '../models/map-info.model';
import { google, GoogleMap } from '@agm/core/services/google-maps-types';
import { AgmMarker } from '@agm/core';
import { OfficeModel } from '../models/office-model';
import { ActivatedRoute } from '@angular/router';
import { OfficeServices } from '../services/office-services';
import { NgForm, Validators, FormControl, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators'
import { ToasterService } from '../toaster-service/toaster-service.component';
import { btmNavDataService } from '../bottom-navbar/btmNavDataService';

@Component({
  selector: 'app-add-office',
  templateUrl: './add-office.component.html',
  styleUrls: ['./add-office.component.css']
})
export class AddOfficeComponent implements OnInit {


  mapInfo: MapInfo;
  lat: number = 45.242268;
  lng: number = 19.84295;
  latMark: number = 45.242268;
  lngMark: number = 19.84295;
  fileToUpload: File = null;
  imageUrl: string = "/assets/images/default-placeholder.png"
  rentServiceId: number;
  isBtnDisabled: boolean;
  showProgress: boolean;
  option:string;

  addOfficeForm: FormGroup;
  Address: FormControl;
  Picture: FormControl;
  


  constructor(private btmNavMessageService: btmNavDataService,private toasterService:ToasterService,private activatedRoute: ActivatedRoute, private officeServices: OfficeServices) {
    activatedRoute.params.subscribe(params => { this.rentServiceId = params["rentServiceId"] });
  }
  ngOnInit() {
    this.btmNavMessageService.currentMessage.subscribe(message => this.showProgress = message)
    this.CreateFormControls();
    this.CreateForm();
    this.isBtnDisabled = true;
  }
  ngOnDestroy() {
    this.btmNavMessageService.changeMessage(false);
  }

  CreateFormControls() {
    this.Address = new FormControl('', [
      Validators.required,
      Validators.maxLength(200),
    ]);
    this.Picture = new FormControl('', [
      Validators.required,
    ]);

  }
  CreateForm() {
    this.addOfficeForm = new FormGroup({
      Address: this.Address,
      Picture: this.Picture,
    });
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
    //Show image preview
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
  }


  placeMarker($event) {
    this.isBtnDisabled = false;
    console.log($event.coords.lat);
    console.log($event.coords.lng);
    this.latMark = $event.coords.lat
    this.lngMark = $event.coords.lng
  }

  onSubmit(office: OfficeModel,form:NgForm) {
    this.btmNavMessageService.changeMessage(true);
    this.isBtnDisabled = true;
    console.log(office);

    office.Latitude = this.latMark;
    office.Longitude = this.lngMark;

    office.Picture = null;
    office.RentServiceId = this.rentServiceId;
    this.officeServices.AddOffice(office, this.fileToUpload).pipe(finalize(
      () => {
        this.isBtnDisabled=false;
        this.btmNavMessageService.changeMessage(false);
      }))
      .subscribe(
        data => {
          //alert("Your changes updated successfully");
          this.toasterService.Info("Office was added",'Info');
          form.reset();
         
        },
        error => {
          this.toasterService.Error(error.error.Message,'Error');
          //alert(error.error.ModelState[""][0]);
         
        }
      );

  }
}
