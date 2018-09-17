import { Component, OnInit } from '@angular/core';
import { UserServices } from '../services/user-services';
import { User } from '../models/user.model';
import { NgForm, FormControl, Validators, FormGroup } from '@angular/forms';
import { EditPassword } from '../models/editPassword';
import { btmNavDataService } from '../bottom-navbar/btmNavDataService';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { finalize } from 'rxjs/operators'
import { ToasterService } from '../toaster-service/toaster-service.component';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  constructor(private toasterService:ToasterService,private btmNavMessageService: btmNavDataService, private localeService: BsLocaleService, private userServices: UserServices) {
    this.bsConfig = Object.assign({}, {
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false,
      dateInputFormat: 'DD.MM.YYYY.',
      maxDate: new Date(),
      minDate: new Date(1910, 1, 1)

    });
    this.localeService.use("en-gb");
  }


  userData: User = new User('no data', 'Full name', 'Email', new Date, 'no dara', 'no data', 'no data', true, true);
  fileToUpload: File = null;
  imageUrl: string = "/assets/images/default-placeholder.png"
  ETag:string;
  showProgress: boolean = false;
  btnDisabled: boolean = true;

  editForm: FormGroup;
  FullName: FormControl;
  Email: FormControl;
  BirthDate: FormControl;
  //DocumentPicture: FormControl;

  bsConfig: Partial<BsDatepickerConfig>;

  ngOnInit() {

    //this.userData.DocumentPicture=this.imageUrl;

    this.CreateFormControls();
    this.CreateForm();

    this.btmNavMessageService.currentMessage.subscribe(message => this.showProgress = message)
    this.btmNavMessageService.changeMessage(true);

    this.userServices.getProfile().pipe(finalize(
      () => {
        this.btmNavMessageService.changeMessage(false);
      }))
      .subscribe(
        data => {
          this.ETag = JSON.parse(data.headers.get('ETag'));
          this.userData = data.body;
          this.userData.BirthDate = new Date(data.body.BirthDate);
          this.btnDisabled = false;
        },
        error => {
          //alert(error.error.Message);
          this.toasterService.Error(error.error.Message,'Error');
        }
      )
  }

  CreateFormControls() {
    this.FullName = new FormControl('', [
      Validators.maxLength(50),
      Validators.minLength(5),
      //Validators.pattern('^(?=.*[a-zA-Z])'),
      Validators.required
    ]);
    this.Email = new FormControl('', [
      Validators.pattern('^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$'),
      Validators.required
    ]);
    this.BirthDate = new FormControl('', [
      // Validators.pattern('^([0-9]{4})\-([0-9]{2})\-([0-9]{2})[T]([0-9]{2})\:([0-9]{2})\:([0-9]{2}).*$'),
      Validators.required]);
    // this.DocumentPicture = new FormControl('', [
    // Validators.required]);
  }
  CreateForm() {
    this.editForm = new FormGroup({
      FullName: this.FullName,
      Email: this.Email,
      BirthDate: this.BirthDate,
      //  DocumentPicture: this.DocumentPicture,
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
  onSubmit(appUser: any) {
    console.log(appUser);
    this.btmNavMessageService.changeMessage(true);


    appUser.BirthDate = appUser.BirthDate.toJSON();

    appUser.UserId = this.userData.UserId;
    appUser.DocumentPicture = this.userData.DocumentPicture;
    this.userServices.EditUser(appUser, this.fileToUpload,this.ETag).pipe(finalize(
      () => {
        this.btmNavMessageService.changeMessage(false);

      }))
      .subscribe(
        data => {
          this.toasterService.Info("Your changes updated successfully",'Info');
          //alert("Your changes updated successfully");
        },
        error => {
          this.toasterService.Error(error.error.Message,'Error');
          //alert(error.error.Message);
        }
      );
  }

}
