import { Component } from '@angular/core';
import { NavController,Platform } from 'ionic-angular';
import { ExpirationdatePage } from '../expirationdate/expirationdate';
import { RecallPage } from '../recall/recall';
import { InsulinguidePage } from '../insulinguide/insulinguide';
import { SubscriptionPage } from "../subscription/subscription"
import { LoginPage } from '../login/login';

import { AngularFireDatabase } from 'angularfire2/database'
import { Storage } from "@ionic/storage"
import { SplitPaneProvider } from '../../providers/split-pane/split-pane';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  
  isTabletOrIpad : boolean;
  
  constructor(public navCtrl: NavController,public platform: Platform,
    private storage: Storage,private db: AngularFireDatabase, public splitPane: SplitPaneProvider) {
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
            

            var container_subscribed = data[0]["subscribed"]
            var container_subscribed_date = data[0]["subscribed_date"]
            
            if(data[0]["subscribed"] == true){
              var nowDateTime = new Date()

              var expiryDateTime = new Date(data[0]["subscribed_date"])
              expiryDateTime.setFullYear(expiryDateTime.getFullYear() + 1)

              console.log(nowDateTime + "|" + expiryDateTime)
              
              //Compare two DateTime in js
              if(nowDateTime >= expiryDateTime){
                  app.storage.set( "subscribed",false )
                  app.storage.set( "subscribed_date", "" )

                  this.db.list("/profiles", ref=> ref.orderByChild("email").equalTo(data[0]["email"]))
                        .snapshotChanges()
                        .map(changes=>{
                          return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
                        })
                        .subscribe(snapshots => {
                          snapshots.forEach(snapshot => {
                            this.db.list("profiles").update(snapshot.key,{
                              subscribed: false,
                              subscribed_date: ""
                            })
                          })
                        });

              }
              else{
                  app.storage.set( "subscribed",container_subscribed )
                  app.storage.set( "subscribed_date", container_subscribed_date )    
              }   
            }
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

  ionViewDidLoad(){
    
  }

  ionViewWillEnter() {  
    if(this.platform.width() > 700){
      this.splitPane.splitPaneState = true;
    }  
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
