import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';
import { ForgotpwdPage } from '../forgotpwd/forgotpwd';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginData = {
    email: "",
    password: ""
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController,
              public afAuth:AngularFireAuth, public alertCtrl: AlertController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login(){
    var app = this;
    let loader = this.loadingCtrl.create({
      content:"Please wait..."    
    });
    loader.present();

    let email = this.loginData.email;
    let pwd = this.loginData.password;
    return this.afAuth.auth.signInWithEmailAndPassword(email,pwd)
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
             this.navCtrl.setRoot(HomePage);
           }
         })

  }

  navToRegister(){
    this.navCtrl.push(RegisterPage)
  }

  navToForgotpwd(){
     this.navCtrl.push(ForgotpwdPage)
  }

}
