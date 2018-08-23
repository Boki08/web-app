import { Component, OnInit } from '@angular/core';
import { ServiceData } from '../models/ServiceData';
import { RentServices } from '../services/rent-service';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css']
})
export class AddServiceComponent implements OnInit {

  constructor(private RentServices:RentServices) { }
  serviceData:ServiceData;
  fileToUpload : File = null;
  imageUrl: string = "/assets/images/default-placeholder.png"

  ngOnInit() {
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
  onSubmit(serviceDataForm:ServiceData){
    console.log(serviceDataForm);
    
    serviceDataForm.Logo=null;
    this.RentServices.AddRentService(serviceDataForm,this.fileToUpload)
    .subscribe(
      data=>{
        alert("Your changes updated successfully");
      },
      error=>{
        alert(error.error.ModelState[""][0]);
      }
    );
  }
}
