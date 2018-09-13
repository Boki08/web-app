import { FormControl, FormGroup, NgForm, FormGroupDirective, AbstractControl } from '@angular/forms';

export class PasswordValidator {

  static MatchPassword(AC: AbstractControl) {
    let password = AC.get('Password').value; // to get value in input tag
    let confirmPassword = AC.get('RepeatedPassword').value; // to get value in input tag
     if(password != confirmPassword) {
         console.log('false');
         AC.get('RepeatedPassword').setErrors( {MatchPassword: true} )
     } else {
         console.log('true');
         return null
     }
 }
}
