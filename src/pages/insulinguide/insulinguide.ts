import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import { ExpirationdatePage } from '../expirationdate/expirationdate';
import { RecallPage } from '../recall/recall';

import { Storage } from "@ionic/storage"

import { SubscriptionPage } from '../subscription/subscription';

import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';
/**
 * Generated class for the InsulinguidePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-insulinguide',
  templateUrl: 'insulinguide.html',
})
export class InsulinguidePage {

  showRes = false
  resExpdate : string = "";
  resNote: string = "";

  insulinGuide: any
  currentEmail : string

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
              public db: AngularFireDatabase,public storage: Storage) 
  {
    var app = this

    this.storage.get("subscribed").then((val)=>{
      if(val == false){
         app.navCtrl.pop()
         app.navCtrl.push(SubscriptionPage)
      }
    })

    // this.storage.get("currentEmail").then((val)=>{
    //     this.currentEmail = val
    //     const profile = db.list("/profiles",ref=>ref.orderByChild("email").equalTo(this.currentEmail)).valueChanges()
    //     profile.subscribe( data => {
    //        if(!data[0]["subscribed"]){
    //           app.navCtrl.pop()
    //           app.navCtrl.push(SubscriptionPage)
    //        }
    //     })
    //  })
     this.insulinGuide = db.list("/insulinguides").valueChanges() 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InsulinguidePage');
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

  calcInsulin(){
    var app = this
    let loader = this.loadingCtrl.create({
      content:"Processing...",
      duration: 5000
    });
    loader.present();
    setTimeout(function(){
      app.showRes = true;
      app.resExpdate = "July 1, 2018";
      app.resNote = "Notes about medication appears here"
    },5000)
    
  }

}
