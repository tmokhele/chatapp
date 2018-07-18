import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Result } from '../../../node_modules/@types/range-parser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  private formSubmitAttempt: boolean;
  constructor(private fb: FormBuilder,
    private myRoute: Router,
    private auth: AuthService) {
    this.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  login(socialPlatform: string) {

    if (socialPlatform == "facebook") {
      this.auth.signInWithFacebook().subscribe(result => {
        this.route(result.user.displayName);
      });

    } if (socialPlatform == "twitter") {
      console.log('Twitter');
      this.auth.signInWithTwitter().subscribe(result => {
        this.route(result.user.displayName);
      });

    }
    if (this.form.valid) {
      if (socialPlatform == "login") {
        var email = this.form.get('email').value;
        var password = this.form.get('password').value;
        this.auth.logonEmail(email, password).subscribe(result => {
          this.auth.retrieveUserInformation(result.uid).subscribe(userInfo => {
            this.route(userInfo.name);
          });
        });
      }
    } if (socialPlatform == "google") {
      this.auth.signInWithGoogle().subscribe(result => {
        this.route(result.user.displayName);
      });

    }


  }

  route(username:any)
  {
    this.auth.sendToken(username);
    this.myRoute.navigate(["chat"])
  }

  isFieldInvalid(field: string) { // {6}
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

}