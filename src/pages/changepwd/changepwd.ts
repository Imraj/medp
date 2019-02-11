import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';
import { Storage } from "@ionic/storage"

/**
 * Generated class for the ChangepwdPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-changepwd',
  templateUrl: 'changepwd.html',
})
export class ChangepwdPage {

  forgotPwdData = {
    email : ""
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public afAuth:AngularFireAuth,private storage: Storage,
    private db: AngularFireDatabase,public loadingCtrl: LoadingController,
    private toastCtrl: ToastController) 
  {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotpwdPage');
  }

  retrievePassword(){
    this.storage.clear()

    let loader = this.loadingCtrl.create({
      content: "Loading...Please wait"
    })
    loader.present()

    let toast = this.toastCtrl.create({
      message: "Password Reset Email Sent",
      duration: 10000
    })

    let email = this.forgotPwdData.email
    firebase.auth().sendPasswordResetEmail(email)
    .then(function(){
        loader.dismiss()
        toast.present()
    })
    .catch(function(){
        loader.dismiss()
    })

  }

}
