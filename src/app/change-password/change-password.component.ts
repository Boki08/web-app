import { Component, OnInit } from '@angular/core';
import { EditPassword } from '../models/editPassword';
import { UserServices } from '../services/user-services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChangePasswordValidator } from 'src/app/change-password/password-validator';
import { btmNavDataService } from '../bottom-navbar/btmNavDataService';
import { finalize } from 'rxjs/operators'
import { ToasterService } from '../toaster-service/toaster-service.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  constructor(private toasterService:ToasterService,private btmNavMessageService: btmNavDataService, private userServices: UserServices) { }


  editPasswordForm: FormGroup;
  OldPassword: FormControl;
  NewPassword: FormControl;
  ConfirmPassword: FormControl;
  Matching_passwords_group: FormGroup;

  disableBtn: boolean = false;
  showProgress: boolean = false;


  ngOnInit() {

    this.btmNavMessageService.currentMessage.subscribe(message => this.showProgress = message)


    this.CreateFormControls();
    this.CreateForm();
    this.btmNavMessageService.changeMessage(true);
    this.btmNavMessageService.changeMessage(false);
  }
  CreateFormControls() {
    this.OldPassword = new FormControl('', [
      Validators.required
    ]);

    this.NewPassword = new FormControl('', [
      Validators.maxLength(30),
      Validators.minLength(6),
      Validators.required
    ]);
    this.ConfirmPassword = new FormControl('', Validators.required);

    this.Matching_passwords_group = new FormGroup({
      NewPassword: this.NewPassword,
      ConfirmPassword: this.ConfirmPassword,
    }, {
        validators: ChangePasswordValidator.MatchPassword
      });

  }
  CreateForm() {
    this.editPasswordForm = new FormGroup({
      OldPassword: this.OldPassword,
      Matching_passwords_group: this.Matching_passwords_group,
    });
  }
  onSubmitPassword(newPassword: any) {
    this.disableBtn = true;
    this.btmNavMessageService.changeMessage(true);
    console.log(newPassword);

    newPassword.NewPassword = newPassword.Matching_passwords_group.NewPassword;
    newPassword.ConfirmPassword = newPassword.Matching_passwords_group.ConfirmPassword;
    delete newPassword.Matching_passwords_group;

    this.userServices.EditPassword1(newPassword)
      .pipe(finalize(
        () => {
          this.btmNavMessageService.changeMessage(false);
          this.disableBtn = false;
        }))
      .subscribe(
        data => {
          this.toasterService.Info("Your changes updated successfully",'Info');
      
        },
        error => {
          this.toasterService.Error(error.error.Message,'Error');
        }
      );
  }
}
