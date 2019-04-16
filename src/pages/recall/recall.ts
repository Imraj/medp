import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { ExpirationdatePage } from '../expirationdate/expirationdate';
import { InsulinguidePage } from '../insulinguide/insulinguide';

import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map'

import { Storage } from "@ionic/storage"
import { SubscriptionPage } from '../subscription/subscription';
import { SplitPaneProvider } from '../../providers/split-pane/split-pane';

/**
 * Generated class for the RecallPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recall',
  templateUrl: 'recall.html',
})
export class RecallPage {
  information : any[];
  currentEmail : string

  months = ["","Jan","Feb","March","April","May","June","July","Aug","Sept","Oct","Nov","Dec"]
  
  order: string = "date"

  constructor(public navCtrl: NavController, private http: Http,public navParams: NavParams,
              public db: AngularFireDatabase,public storage: Storage,
              public splitPane: SplitPaneProvider, public platform: Platform) 
  {

    var app = this
    this.storage.get("currentEmail").then((val)=>{
        this.currentEmail = val
        this.storage.get("subscribed").then((val)=>{
           if(val == false){
              app.navCtrl.pop()
              app.navCtrl.push(SubscriptionPage)
           }
        })
    })

    const recalls = db.list("/recalls",ref=>ref.orderByChild("medicine")).valueChanges()
    recalls.subscribe( rec => {
      //console.log("Recall",rec)
      let items = []
      for(var r in rec)
      {
        let recall = rec[r]
        let recallF1 = {
          "name":recall["medicine"],
          "children":[{
              name: recall["manufacturer"],
              description: recall["description"],
              reason: recall["reason"],
              rday: recall["date"]["day"],
              rmonth: recall["date"]["month"],
              ryear: recall["date"]["year"],
              recalldate : recall["date"]["day"] + "/" + recall["date"]["month"] + "/" + recall["date"]["year"]
          }]
        }
        //console.log("this-array",items)
        items.push(recallF1)
        console.log("recallF1",recallF1)
      }
      console.log("app.items",{"items":items})
      this.information = items
    })

  }

  toggleSection(i) {
    this.information[i].open = !this.information[i].open;
  }
 
  toggleItem(i, j) {
    this.information[i].children[j].open = !this.information[i].children[j].open;
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad RecallPage');
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

}
