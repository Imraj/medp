import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { RecallPage } from '../recall/recall';
import { InsulinguidePage } from '../insulinguide/insulinguide';

import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map'
import { Storage } from "@ionic/storage"

import { Observable } from 'rxjs';

import { SubscriptionPage } from '../subscription/subscription';
/**
 * Generated class for the ExpirationdatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-expirationdate',
  templateUrl: 'expirationdate.html',
})
export class ExpirationdatePage {

  showRes = false
  resExpdate : string = "";
  resNote: string = "";

  medTypes: Observable<any[]>
  medications: Observable<any[]>

  currentEmail : string
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,private db: AngularFireDatabase,public storage: Storage) 
  {
      this.medTypes = db.list("medications").valueChanges()
      this.medications = db.list("medications").valueChanges()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpirationdatePage');
  }

  navToExpirationdate(){
    this.navCtrl.push(ExpirationdatePage)
  }

  navToRecall(){
    this.navCtrl.push(RecallPage)
  }

  navToInsulin(){
    this.navCtrl.push(InsulinguidePage)
  }

  calcExpirationDate(){
    var app = this
    let loader = this.loadingCtrl.create({
        content:"Processing...",
        duration: 5000
    });
    loader.present();
    setTimeout(function(){
      app.showRes = true;
      app.resExpdate = "July 1, 2018";
      app.resNote = "Notes about medication appears here via ion-card";
    },5000)
  }
    
  

}
