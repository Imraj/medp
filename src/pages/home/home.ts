import { Component } from '@angular/core';
import { NavController,Platform } from 'ionic-angular';
import { ExpirationdatePage } from '../expirationdate/expirationdate';
import { RecallPage } from '../recall/recall';
import { InsulinguidePage } from '../insulinguide/insulinguide';
import { SubscriptionPage } from "../subscription/subscription"
import { LoginPage } from '../login/login';

import { AngularFireDatabase } from 'angularfire2/database'
import { Storage } from "@ionic/storage"

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  
  isTabletOrIpad : boolean;
  
  constructor(public navCtrl: NavController,public platform: Platform,
    private storage: Storage,private db: AngularFireDatabase) {
    this.isTabletOrIpad = this.platform.is('tablet') || this.platform.is('ipad');
 
    var app = this
    
    this.storage.get("currentEmail").then((val)=>{
      if(val != null || val != undefined){
        const profile = app.db.list("/profiles", ref=> ref.orderByChild("email").equalTo(val)).valueChanges()
        profile.subscribe(data => {
          if(data.length == 0){
            this.navCtrl.setRoot(LoginPage)
          }
          else{
            app.storage.set( "age", data[0]["age"] )
            app.storage.set( "email",data[0]["email"] )
            app.storage.set( "admin",data[0]["admin"])
            app.storage.set( "ethnicity",data[0]["ethnicity"])
            app.storage.set( "fullname",data[0]["fullname"] )
            app.storage.set( "gender", data[0]["gender"] )
            app.storage.set( "occupation",data[0]["occupation"])
            app.storage.set( "state",data[0]["state"])
            app.storage.set( "country",data[0]["country"])
            app.storage.set( "subscribed",data[0]["subscribed"] )
            app.storage.set( "subscribed_date", data[0]["subscribed_date"] )
          }

        },err=>{
          console.log("Err")
          console.log(err)
        });
      }else{
        this.storage.clear()
        this.navCtrl.setRoot(LoginPage)
      }

    })
 
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

  navToSub(){
    this.navCtrl.push(SubscriptionPage)
  }

}
