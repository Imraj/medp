import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';
import { Storage } from "@ionic/storage"
import { SplitPaneProvider } from '../../providers/split-pane/split-pane';

/**
 * Generated class for the ForgotpwdPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgotpwd',
  templateUrl: 'forgotpwd.html',
})
export class ForgotpwdPage {

  forgotPwdData = {
    email : ""
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public afAuth:AngularFireAuth,private storage: Storage,
    private db: AngularFireDatabase,public loadingCtrl: LoadingController,
    private toastCtrl: ToastController, public splitPane: SplitPaneProvider,
    public platform: Platform) 
  {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotpwdPage');
  }

  ionViewWillEnter() {    
    this.splitPane.splitPaneState = false; 
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
