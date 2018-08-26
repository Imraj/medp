import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';
import { Storage } from "@ionic/storage"
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
    private db: AngularFireDatabase) 
  {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotpwdPage');
  }

  retrievePassword(){

    let email = this.forgotPwdData.email
    firebase.auth().sendPasswordResetEmail(email)
    .then(function(){

    })
    .catch(function(){
      
    })

  }

}
