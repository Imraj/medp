import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ExpirationdatePage } from '../expirationdate/expirationdate';
import { InsulinguidePage } from '../insulinguide/insulinguide';

import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map'

import { Storage } from "@ionic/storage"
import { SubscriptionPage } from '../subscription/subscription';

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
  information : any;
  currentEmail : string
  
  //arr : any[]
  constructor(public navCtrl: NavController, private http: Http,public navParams: NavParams,
              public db: AngularFireDatabase,public storage: Storage) 
  {

    var app = this
    this.storage.get("currentEmail").then((val)=>{
        this.currentEmail = val

        const profile = db.list("/profiles",ref=>ref.orderByChild("email").equalTo(this.currentEmail)).valueChanges()
        profile.subscribe( data => {
            if(!data[0]["subscribed"]){
              //app.navCtrl.pop()
              //app.navCtrl.push(SubscriptionPage)
            }
        })

    })

    const recalls = db.list("/recalls").valueChanges()
    recalls.subscribe( rec => {
      console.log("Recall",rec)
      let items = []
      for(var r in rec)
      {
        let recall = rec[r]
        let recallF1 = {
          "name":recall["medicine"],
          "children":[{
              name: recall["manufacturer"],
              information: recall["reason"],
          }]
        }
        console.log("this-array",items)
        items.push(recallF1)
      }

      console.log("app.items",items)
      this.information = {"items":items}

    })

    // let localData = http.get('assets/information.json').map(res => res.json().items);
    // localData.subscribe(data => {
    //   this.information = data;
    // })



  }

  toggleSection(i) {
    this.information[i].open = !this.information[i].open;
  }
 
  toggleItem(i, j) {
    this.information[i].children[j].open = !this.information[i].children[j].open;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecallPage');
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
