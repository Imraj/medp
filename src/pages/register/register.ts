import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  regData = {
    email:"",
    fullname:"",
    password: "",
    password2: ""
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
              public afAuth: AngularFireAuth,public db: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  createAccount(){

    let loader = this.loadingCtrl.create({
      content:"Please wait..."    
    });
    loader.present();

    let email = this.regData.email;
    let fullname = this.regData.fullname;
    let pwd = this.regData.password;

    return this.afAuth.auth.createUserWithEmailAndPassword(email,pwd)
        .then(function(err){
          if(err){
            loader.dismiss();
            let alert = this.alertCtrl.create({
             title: "Error",
             subTitle: err,
             buttons: ['Ok']
            });
            alert.present();

          }
          else{
            loader.dismiss();
            let alert = this.alertCtrl.create({
              title: "Success",
              subTitle: "Account created successfully. Login to continue",
              buttons: ['Ok']
             });
             alert.present();
          }
        })

  }

  navToLogin(){
    this.navCtrl.push(LoginPage)
  }

}
