import { Component, OnInit } from '@angular/core';
import { ServiceData } from '../models/ServiceData';
import { RentServices } from '../services/rent-service';
import { finalize } from 'rxjs/operators'
import { Validators, FormControl, FormGroup, NgForm } from '@angular/forms';
import { ToasterService } from '../toaster-service/toaster-service.component';
import { btmNavDataService } from '../bottom-navbar/btmNavDataService';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css']
})
export class AddServiceComponent implements OnInit {

  constructor(private btmNavMessageService: btmNavDataService,private toasterService:ToasterService,private RentServices:RentServices) {
   
   }
  serviceData:ServiceData;
  fileToUpload : File = null;
  imageUrl: string = "/assets/images/default-placeholder.png"
  disableBtn:boolean=false;

  addServiceForm: FormGroup;
  Name: FormControl;
  Email: FormControl;
  Description: FormControl;
  Logo: FormControl;


  ngOnInit() {
    this.CreateFormControls();
    this.CreateForm();
    this.btmNavMessageService.changeMessage(true);
    this.btmNavMessageService.changeMessage(false);
  }

  CreateFormControls() {
    this.Name = new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
    ]);
    this.Description = new FormControl('', [
      Validators.required,
      Validators.maxLength(250),
    ]);
    this.Email = new FormControl('', [
      Validators.pattern('^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$'),
      Validators.required,
      Validators.maxLength(100),
    ]);
    this.Logo = new FormControl('', Validators.required);

  }
  CreateForm() {
    this.addServiceForm = new FormGroup({
      Name: this.Name,
      Description: this.Description,
      Email: this.Email,
      Logo: this.Logo,
    });
  }

  handleFileInput(file: FileList){
    this.fileToUpload = file.item(0);
    //Show image preview
    var reader = new FileReader();
    reader.onload = (event:any)=>{
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
  }
  onSubmit(serviceDataForm:ServiceData,form:NgForm){
    console.log(serviceDataForm);
    this.btmNavMessageService.changeMessage(true);
    serviceDataForm.Logo=null;
    this.disableBtn=true;
    this.RentServices.AddRentService(serviceDataForm,this.fileToUpload) .pipe(finalize(
      () => {
        
        
        this.btmNavMessageService.changeMessage(false);
        this.disableBtn = false;
      }))
    .subscribe(
      data=>{
        this.fileToUpload==null;
        this.imageUrl = "/assets/images/default-placeholder.png"
        this.toasterService.Info("Your changes updated successfully",'Info');
        form.reset();
      },
      error=>{
        this.toasterService.Error(error.error.Message,'Error');
      }
    );
  }
}
