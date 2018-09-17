import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Validators, FormGroup, FormControl, NgForm } from '@angular/forms';
import { btmNavDataService } from '../bottom-navbar/btmNavDataService';
import { OfficeModel } from '../models/office-model';
import { OfficeServices } from '../services/office-services';
import { ToasterService } from '../toaster-service/toaster-service.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-office',
  templateUrl: './edit-office.component.html',
  styleUrls: ['./edit-office.component.css']
})
export class EditOfficeComponent implements OnInit {

  constructor(private btmNavMessageService: btmNavDataService, private officeServices: OfficeServices, private toasterService: ToasterService, private activatedRoute: ActivatedRoute) {
    activatedRoute.params.subscribe(params => { this.officeId = params["officeId"] });
  }

  fileToUpload: File = null;
  imageUrl: string = "/assets/images/default-placeholder.png"
  ETag: string;

  officeId: number;
  latMark: number = 45.242268;
  lngMark: number = 19.84295;

  addOfficeForm: FormGroup;
  Address: FormControl;

  office: OfficeModel;

  isBtnDisabled: boolean = true;
  showProgress: boolean;

  ngOnInit() {
    this.btmNavMessageService.currentMessage.subscribe(message => this.showProgress = message)
    this.btmNavMessageService.changeMessage(true);
    this.CreateFormControls();
    this.CreateForm();
    this.isBtnDisabled = true;

    this.officeServices.GetOffice(this.officeId).pipe(finalize(
      () => {
        this.btmNavMessageService.changeMessage(false);
      }))
      .subscribe(
        data => {
          this.ETag = JSON.parse(data.headers.get('ETag'));

          this.office = data.body as OfficeModel;
          if (this.office.Picture != null && this.office.Picture != '') {
            this.imageUrl = 'http://localhost:51680/api/office/getOfficePicture?path=' + this.office.Picture;
            this.isBtnDisabled = false;
          }
          else {
            this.isBtnDisabled = true;
          }
          this.latMark = this.office.Latitude;
          this.lngMark = this.office.Longitude;
        },
        error => {
          this.toasterService.Error(error.error.Message, 'Error');
          console.log(error);
        }
      )
  }
  ngOnDestroy() {
    this.btmNavMessageService.changeMessage(false);
  }



  CreateFormControls() {
    this.Address = new FormControl('', [
      Validators.required,
      Validators.maxLength(200),
    ]);


  }
  CreateForm() {
    this.addOfficeForm = new FormGroup({
      Address: this.Address,

    });
  }

  handleFileInput(file: FileList) {
    this.isBtnDisabled = false;
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

  onSubmit(office: OfficeModel, form: NgForm) {
    this.btmNavMessageService.changeMessage(true);
    this.isBtnDisabled = true;
    console.log(office);

    office.Latitude = this.latMark;
    office.Longitude = this.lngMark;

    office.Picture = null;
    office.RentServiceId = this.office.RentServiceId;
    this.officeServices.EditOffice(office, this.fileToUpload, this.ETag).pipe(finalize(
      () => {
        this.isBtnDisabled = false;
        this.btmNavMessageService.changeMessage(false);
      }))
      .subscribe(
        data => {
          //alert("Your changes updated successfully");
          this.toasterService.Info("Office was edited", 'Info');
          //form.reset();

        },
        error => {
          this.toasterService.Error(error.error.Message, 'Error');
          //alert(error.error.ModelState[""][0]);

        }
      );

  }
}
