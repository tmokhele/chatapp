import { OnInit, Component } from "@angular/core";
import { User } from '../models/user.model';
import { FormGroup, FormBuilder, Validators } from "../../../node_modules/@angular/forms";
import { AuthService } from "../auth.service";
import { Router } from "../../../node_modules/@angular/router";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  user = new User();
  form: FormGroup;
  private formSubmitAttempt: boolean;
  constructor(private fb: FormBuilder, private myRoute: Router,private auth: AuthService) {
    this.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(12)])],
      confirmPassword: ['', Validators.required],
    }, { validator: this.matchingPasswords('password', 'confirmPassword') });

  }

  ngOnInit() {
  }

  register(): void {
    console.log(this.user);
    this.auth.registerUser(this.user).then((createdUser) => {
      console.log('Registered User: '+JSON.stringify(createdUser))
    });
  }

  isFieldInvalid(field: string) { // {6}
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }
  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }
}


