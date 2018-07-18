import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { User } from './models/user.model';
import { AngularFireDatabase, AngularFireList } from '../../node_modules/angularfire2/database';

@Injectable()
export class AuthService {
  private user: Observable<firebase.User>;
  private currentUser: firebase.User;
  db: AngularFireDatabase;
  private subscription;
  userDetailsList: AngularFireList<any>;
  userInfo: { name: string, uid: string, email: string }
    = { name: '', uid: '', email: '' };
  constructor(private _firebaseAuth: AngularFireAuth, private myRoute: Router, db: AngularFireDatabase) {
    this.user = _firebaseAuth.authState;
    this.db = db;
  }

  sendToken(token: any) {
    console.log('token: ' + token)
    localStorage.setItem("LoggedInUser", token)
  }

  signInWithTwitter() {
    return Observable.create(observer => {
      this._firebaseAuth.auth.signInWithPopup(
        new firebase.auth.TwitterAuthProvider()
      ).then(function (result) {
        observer.next(result);
      }).catch((error) => {
        observer.error(error);
      });
    });
  }

  registerUser(user: User) {
    return this._firebaseAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
      .then((createdUser) => {
        this.currentUser = createdUser;
        this.currentUser.sendEmailVerification()
        var ref = firebase.app().database().ref();
        var userProfileRef = ref.child('personalInformation');
        this.userInfo.uid = createdUser.uid;
        this.userInfo.name = user.username;
        this.userInfo.email = user.email;
        return userProfileRef.push(this.userInfo);
      });
  }

  retrieveUserInformation(userId: string) {
    return Observable.create(observer => {
      this.subscription = firebase.database().ref('personalInformation')
        .orderByChild('uid').equalTo(userId).on('value', function (snapshot) {
          var s = JSON.stringify(snapshot);
          if (s != 'null') {
            snapshot.forEach((childSnapshot) => {
              var user = childSnapshot.val();
              observer.next(user);
              return false;
            });
          } else if (s == 'null') {
            observer.next(snapshot)
          }
        });
    });
  }

  signInWithGoogle() {
    return Observable.create(observer => {
      this._firebaseAuth.auth.signInWithPopup(
        new firebase.auth.GoogleAuthProvider()
      ).then(function (result) {
        observer.next(result);
      }).catch((error) => {
        observer.error(error);
      });
    });
  }

  signInWithFacebook() {
    return Observable.create(observer => {
      this._firebaseAuth.auth.signInWithPopup(
        new firebase.auth.FacebookAuthProvider()
      ).then(function (result) {
        observer.next(result);
      }).catch((error) => {
        observer.error(error);
      });
    });
  }
  logonEmail(email: any, password: any) {
    return Observable.create(observer => {
      console.log('email login: ' + email + " password: " + password)
      this._firebaseAuth.auth.signInWithEmailAndPassword(email, password).then((authData) => {
        observer.next(authData);
      }).catch((error) => {
        observer.error(error);
      });
    });
  }


  getToken() {
    return localStorage.getItem("LoggedInUser")
  }

  isLoggednIn() {
    return this.getToken() !== null;
  }

  logout() {
    localStorage.removeItem("LoggedInUser");
    this.myRoute.navigate(["login"]);
  }


}
