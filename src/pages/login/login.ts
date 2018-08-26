import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';
import { ForgotpwdPage } from '../forgotpwd/forgotpwd';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';
import { Storage } from "@ionic/storage"

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

  currentEmail : string

  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController,
              public afAuth:AngularFireAuth, public alertCtrl: AlertController,public toastCtrl: ToastController,
              private storage: Storage,private db: AngularFireDatabase) 
  {
    
    

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login()
  {
    var app = this;

    let email = this.loginData.email;
    let pwd = this.loginData.password;
    if(email == "" || pwd == "")
    {
      let alert = app.alertCtrl.create({
        title: "Error",
        subTitle: "Email and Password is required",
        buttons: ['Ok']
      });
      alert.present();
    }
    else
    {
      let loader = this.loadingCtrl.create({
        content:"Please wait...",
      });
      loader.present();

      return this.afAuth.auth.signInWithEmailAndPassword(email,pwd)
         .then(function(res){

            loader.dismiss()
            app.currentEmail = firebase.auth().currentUser.email
            app.storage.set("currentEmail",app.currentEmail)
            app.navCtrl.setRoot(HomePage)  

            console.log("app.currentEmail",app.currentEmail)

            const profile = app.db.list("/profiles", ref=> ref.orderByChild("email").equalTo(app.currentEmail)).valueChanges()
            profile.subscribe(data => {
              console.log("Data")
              console.log(data)
              console.log( data[0] )
            
              app.storage.set( "age", data[0]["age"] )
              app.storage.set( "email",data[0]["email"] )
              app.storage.set( "ethnicity",data[0]["ethnicity"])
              app.storage.set( "fullname",data[0]["fullname"] )
              app.storage.set( "gender", data[0]["gender"] )
              app.storage.set( "occupation",data[0]["occupation"])
              app.storage.set( "state",data[0]["state"])
              app.storage.set( "country",data[0]["country"])
              app.storage.set( "subscribed",data[0]["subscribed"] )
              app.storage.set( "subscribed_date", data[0]["subscribed_date"] )
      
            },err=>{
              console.log("Err")
              console.log(err)
            });

         },
         function(err){
            loader.dismiss();
              
            let alert = app.alertCtrl.create({
              title: "Error",
              subTitle: err,
              buttons: ['Ok']
            });
            alert.present();
         })
    }
  }

  navToRegister(){
    this.navCtrl.push(RegisterPage)
  }

  navToForgotpwd(){
     this.navCtrl.push(ForgotpwdPage)
  }

}
