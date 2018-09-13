import { Component, OnInit, Input } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../models/user.model'
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserServices } from '../services/user-services';
import { PasswordValidator } from './password-validator';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { enGbLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { btmNavDataService } from '../bottom-navbar/btmNavDataService';
defineLocale('en-gb', enGbLocale);
import { finalize } from 'rxjs/operators'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],

})
export class RegisterComponent implements OnInit {
  /*  minDate = "1900-1-1";
   //minDate = new Date(1850, 0, 1);
   date = new Date();
   user = new User('1', '1', '1', new Date, '1', '1', '1', true, true);
   maxDate = this.date.getFullYear() + "-" + (this.date.getMonth() + 1) + "-" + this.date.getDate(); */


  constructor(private btmNavMessageService: btmNavDataService, private localeService: BsLocaleService, private UserService: UserServices) {
    this.bsConfig = Object.assign({}, {
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false,
      dateInputFormat: 'DD.MM.YYYY.',
      maxDate: new Date(),
      minDate: new Date(1910, 1, 1)

    });
    this.localeService.use("en-gb");
  }

  regForm: FormGroup;
  Matching_passwords_group: FormGroup;
  FullName: FormControl;
  Password: FormControl;
  RepeatedPassword: FormControl;
  Email: FormControl;
  BirthDate: FormControl;
  bsConfig: Partial<BsDatepickerConfig>;
  showProgress: boolean = false;


  ngOnInit() {
    this.btmNavMessageService.currentMessage.subscribe(message => this.showProgress = message)
    this.CreateFormControls();
    this.CreateForm();
  }
  CreateFormControls() {
    this.FullName = new FormControl('', [
      Validators.maxLength(50),
      Validators.minLength(5),
      //Validators.pattern('^(?=.*[a-zA-Z])'),
      Validators.required
    ]);
    this.Password = new FormControl('', [
      Validators.maxLength(30),
      Validators.minLength(6),
      // Validators.pattern('^(?=.*\d)(?=.*[!@#$%^*/\._?])(?=.*[a-z])(?=.*[A-Z]).{7,}$'),
      Validators.required
    ]);
    this.RepeatedPassword = new FormControl('', Validators.required);

    this.Matching_passwords_group = new FormGroup({
      Password: this.Password,
      RepeatedPassword: this.RepeatedPassword,
    }, {
        validators: PasswordValidator.MatchPassword
      });
    this.Email = new FormControl('', [
      Validators.pattern('^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$'),
      Validators.required
    ]);
    this.BirthDate = new FormControl('', [
      // Validators.pattern('^([0-9]{4})\-([0-9]{2})\-([0-9]{2})[T]([0-9]{2})\:([0-9]{2})\:([0-9]{2}).*$'),
      Validators.required]);
  }
  CreateForm() {
    this.regForm = new FormGroup({
      FullName: this.FullName,
      /* Password: this.Password,
      RepeatedPassword: this.RepeatedPassword, */
      Matching_passwords_group: this.Matching_passwords_group,
      Email: this.Email,
      BirthDate: this.BirthDate,
    });
  }
  onSubmit(user: any, form: NgForm) {
    this.btmNavMessageService.changeMessage(true);
    console.log(user);
    user.BirthDate = user.BirthDate.toJSON();
    user.Password = user.Matching_passwords_group.Password;
    user.RepeatedPassword = user.Matching_passwords_group.RepeatedPassword;
    delete user.Matching_passwords_group;
    //user.birthDate=/* JSON.stringify(user.birthDate) */user.birthDate["year"]+'-'+user.birthDate["month"]+'-'+user.birthDate["day"]+'T00:00:00';
    this.UserService.register(user) .pipe(finalize(
      () => {
        this.btmNavMessageService.changeMessage(false);
      }))
    .subscribe(
      data => {
        alert("You registered successfully");
      },
      error => {
        alert(error.error.Message);
        console.log(error);
      })
    form.reset();
  }

}
